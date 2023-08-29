/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

// function processScriptsAndStylesheets(): void {
//   const scripts = document.querySelectorAll("script[src]");
//   const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');

//   const processElement = (element: Element | null, attribute: string) => {
//     try {
//       const existingNonce = element?.getAttribute("nonce");
//       const nonce = existingNonce || generateNonce();

//       element?.setAttribute("nonce", nonce);

//       const absoluteURL = new URL(
//         element?.getAttribute(attribute) || "",
//         window.location.origin
//       ).href;
//       element?.setAttribute(attribute, absoluteURL);
//     } catch (error) {
//       console.error("Error processing element:", error);
//     }
//   };

//   scripts.forEach((script) => processElement(script, "src"));
//   stylesheets.forEach((stylesheet) => processElement(stylesheet, "href"));
// }

function evalInIframe(iframe: HTMLIFrameElement, code: string): any {
  console.log('Executing code:', code);
  const result = (iframe.contentWindow as any)?.eval(code);
  console.log('Execution result:', result);
  return result;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.runtime.onMessage.addListener((message) => {
  console.log('Received message:', message);
  const iframe = document.querySelector('iframe');
  if (!iframe) {
    console.error('Iframe not found!');
    return;
  }

  try {
    switch (message.action) {
      case 'applyTooltipTheme': {
        if (message.themeData && message.themeData.name) {
          const themeDataString = JSON.stringify(message.themeData);
          evalInIframe(
            iframe,
            `editor.defineTheme('${message.themeData.name}', ${themeDataString});`,
          );
          evalInIframe(iframe, `editor.setTheme('${message.themeData.name}');`);
        } else {
          console.warn('Theme data is incomplete or missing');
        }
        break;
      }

      case 'setTabWidth': {
        if (message.width) {
          evalInIframe(
            iframe,
            `editor.updateOptions({ tabSize: ${message.width} });`,
          );
        }
        break;
      }

      case 'saveCode': {
        try {
          const codeToSave = evalInIframe(iframe, `editor.getValue()`);
          chrome.storage.local.set({ savedCode: codeToSave }, function () {
            if (chrome.runtime.lastError) {
              console.error('Error saving code:', chrome.runtime.lastError);
            } else {
              console.log('Code saved successfully');
            }
          });
        } catch (error) {
          console.error('Error executing saveCode:', error);
        }
        break;
      }

      case 'loadCode': {
        try {
          chrome.storage.local.get('savedCode', (data) => {
            if (data && data.savedCode) {
              evalInIframe(iframe, `editor.setValue('${data.savedCode}')`);
            } else {
              console.warn('No saved code found');
            }
          });
        } catch (error) {
          console.error('Error executing loadCode:', error);
        }
        break;
      }

      default: {
        console.error('Unhandled action type:', message.action);
        break;
      }
    }
  } catch (error) {
    console.error('Error executing script:', error);
  }
});
