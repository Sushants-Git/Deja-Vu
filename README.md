# ![Group 6(1)](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/e80b1a1c-1d70-4911-ac56-8c2e8ce0c013) Deja Vu - An AI powered bookmarker

A Chrome Extension which offers a seamless way to find bookmarks.

## How it works


https://github.com/Sushants-Git/Deja-Vu/assets/100516354/2e71d2c3-eb64-47e1-862a-c70b73c1d6cf


## Installation

1. Clone the installation repo locally by `git clone https://github.com/Sushants-Git/Deja-Vu-Installation-Files.git`

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/648d5738-51a8-4005-af92-8d7488be3d00)

⚠️  NOTE : We are cloning the Installation repo and not this repo.

OR

Download the ZIP files
- Go to [Deja-Vu-Installation-Files ](https://github.com/Sushants-Git/Deja-Vu-Installation-Files)
- Click on "Code" > "Download ZIP"

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/9b6ae887-4746-486e-8bab-33719ffc7b09)

2. Go to `Chrome`(or any Chromium-based browsers like Brave, Opera etc.) and click on the `Kebab Menu` on the top-right and go to "Extensions" > "Manage Extensions".

![screenshot-20231001-030752Z-all](https://github.com/Sushants-Git/Youtube-Controller/assets/100516354/62ecce48-9f20-45d7-8516-a89e4032cf79)

3. Switch **ON** the `Developer Mode` at the top-right corner.

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/5768cde9-056f-449e-8ac1-921bb6b8b49a)

4. Click on `Load Unpack` at the top-left corner

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/8c409fd8-7efa-460f-bba6-4fbb33ef5a25)

5. Choose the directory in which you cloned the repo and click Open

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/cdc76929-cd9c-4cf4-b4a3-e98813d831b3)

🎉 The extension has been installed.

![image](https://github.com/Sushants-Git/Deja-Vu/assets/100516354/4308a12f-05d2-4f21-b90e-0318c0b82649)


## Running the Project Locally

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

