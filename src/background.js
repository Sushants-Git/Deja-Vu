// background.js - Handles requests from the UI, runs the model, then sends back a response

import { pipeline, env } from "@xenova/transformers";

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false;

// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;

// Compute sentence embeddings

// Tensor {
//   dims: [ 2, 384 ],
//   type: 'float32',
//   data: Float32Array(768) [ 0.04592696577310562, 0.07328180968761444, ... ],
//   size: 768
// }

// let question = "Who was Jim Henson?";
// let context = "Jim Henson was a nice puppet.";

// let answerer = await pipeline(
//   "question-answering",
//   "Xenova/distilbert-base-uncased-distilled-squad"
// );
// let output = await answerer(question, context);

// console.log("Output");

class PipelineSingleton {
  static task = "feature-extraction";
  static model = "Supabase/gte-small";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Create generic classify function, which will be reused for the different types of events.
const classify = async (sentence1, sentence2) => {
  // console.log("Running");
  // Get the pipeline instance. This will load and build the model when run for the first time.
  let model = await PipelineSingleton.getInstance((data) => {
    // You can track the progress of the pipeline creation here.
    // e.g., you can send `data` back to the UI to indicate a progress bar
    // console.log('progress', data)
  });

  //   let question = "Who was Jim Henson?";
  //   let context = "Jim Henson was a nice puppet.";

  //   let answerer = await pipeline(
  //     "question-answering",
  //     "Xenova/distilbert-base-uncased-distilled-squad"
  //   );

  // Actually run the model on the input text
  let embedding1 = await model(sentence1, {
    pooling: "mean",
    normalize: true,
  });

  let embedding2 = await model(sentence2, {
    pooling: "mean",
    normalize: true,
  });

  embedding1 = Array.from(embedding1.data);
  embedding2 = Array.from(embedding2.data);

  const similarity = calculateCosineSimilarity(embedding1, embedding2);

  // console.log(similarity);

  let result = similarity;

  function calculateCosineSimilarity(embedding1, embedding2) {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
    }

    // Calculate magnitudes
    let magnitude1 = 0;
    let magnitude2 = 0;
    for (let i = 0; i < embedding1.length; i++) {
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    // Calculate cosine similarity
    const similarity = dotProduct / (magnitude1 * magnitude2);
    return similarity;
  }

  return result;
};

////////////////////// 1. Context Menus //////////////////////
//
// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(function () {
  // Register a context menu item that will only show up for selection text.
  chrome.contextMenus.create({
    id: "classify-selection",
    title: 'Classify "%s"',
    contexts: ["selection"],
  });
});

// Perform inference when the user clicks a context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Ignore context menu clicks that are not for classifications (or when there is no input)
  if (info.menuItemId !== "classify-selection" || !info.selectionText) return;

  // Perform classification on the selected text
  let result = await classify(info.selectionText);

  // Do something with the result
  chrome.scripting.executeScript({
    target: { tabId: tab.id }, // Run in the tab that the user clicked in
    args: [result], // The arguments to pass to the function
    function: (result) => {
      // The function to run
      // NOTE: This function is run in the context of the web page, meaning that `document` is available.
      console.log("result", result);
      console.log("document", document);
    },
  });
});
//////////////////////////////////////////////////////////////

////////////////////// 2. Message Events /////////////////////
//
// Listen for messages from the UI, process it, and send the result back.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log("sender", sender);
  if (message.action !== "classify") return; // Ignore messages that are not meant for classification.

  // Run model prediction asynchronously
  (async function () {
    // Perform classification
    let result = await classify(message.sentence1, message.sentence2);

    // Send response back to UI
    sendResponse(result);
  })();

  // return true to indicate we will send a response asynchronously
  // see https://stackoverflow.com/a/46628145 for more information
  return true;
});
//////////////////////////////////////////////////////////////
