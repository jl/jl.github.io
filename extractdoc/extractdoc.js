const css = `
  @media screen {
    .page img {
      width: 100vw;
    }
  }
  @media print {
    .page {
      width: auto;
      height: 100%;
      page-break-after: always;
    }
    .page img {
      height: 100%;
    }
  }
  `;

function findTitle(doc) {
  try {
    let title = doc.parentElement.previousElementSibling.textContent;
    title = title.replace('.', '_');
    return title;
  } catch (e) {
    console.error(e);
    return 'document';
  }
}

function extractDoc() {
  const dlist = document.getElementsByClassName("react-pdf__Document");
  if (!dlist) {
    console.log('no pdf document visible');
    return;
  }
  const doc = dlist[0];
  const title = findTitle(doc);

  const handle = window.open('', 'mydoc');
  if (!handle) {
    console.log('allow popup and try again');
    return;
  }
  try {
    handle.document.write(`<!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>${css}</style>
      </head>
    <body>`);
    for (let page of doc.children) {
      const pageNum = page.getAttribute('data-page-number');
      if (!pageNum) {
        continue;
      }
      for (let child of page.children) {
        if (child.tagName === 'CANVAS') {
          let url = child.toDataURL();
          handle.document.write(`<div class="page"><img src="${url}"></div>`);
          break;
        }
      }
    }
    handle.document.write('</body></html>');
  }
  finally {
    handle.document.close();
  }
}

extractDoc();
