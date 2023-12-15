# Deja Vu - An AI powered bookmarker

A Chrome Extension which offers a seamless way to find bookmakrs.

## Getting Started

1. Clone the repo and enter the project directory:
   ```bash
   git clone https://github.com/Sushants-Git/Deja-Vu.git
   cd Deja-Vu
   ```
1. Install the necessary dependencies:

   ```bash
   npm install
   ```

1. Build the project:

   ```bash
   npm run build
   ```

1. Add the extension to your browser. To do this, go to `chrome://extensions/`, enable developer mode (top right), and click "Load unpacked". Select the `build` directory from the dialog which appears and click "Select Folder".

1. That's it! You should now be able to open the extenion's popup and use the model in your browser!

## Development

We recommend running `npm run dev` while editing the project as it will rebuild the project when changes are made.

All source code can be found in the `./src/` directory but the `options` (The page where you see all your bookmarks) will be found in `.public/options.*`:

- `background.js` ([service worker](https://developer.chrome.com/docs/extensions/mv3/service_workers/)) - handles all the requests from the UI, does processing in the background, then returns the result. You will need to reload the extension (by visiting `chrome://extensions/` and clicking the refresh button) after editing this file for changes to be visible in the extension.

- `popup.html`, `popup.css`, `popup.js` ([toolbar action](https://developer.chrome.com/docs/extensions/reference/action/)) - contains the code for the popup which is visible to the user when they click the extension's icon from the extensions bar. For development, we recommend opening the `popup.html` file in its own tab by visiting `chrome-extension://<ext_id>/popup.html` (remember to replace `<ext_id>` with the extension's ID). You will need to refresh the page while you develop to see the changes you make.


## Resources

- Made possible by [Xenova](https://github.com/xenova/transformers.js) and [Supabase / gte-small](https://huggingface.co/Supabase/gte-small)

- This REAME.md file is very similary to [Xenova Chrome Extension Template](https://github.com/xenova/transformers.js/blob/main/examples/extension/README.md) README.md file, since it was there Chrome extension template on which this project was built.

