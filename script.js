const url = "./pdf/Marriage.pdf";

let pdfDocs = null;
let pageNum =1;
let pageIsRendering = false;
let pageNumIsPending =null;

const scale = 1.5;
const canvas = document.querySelector("#pdf-display");
const ctx = canvas.getContext("2d");

//display page 
function displayPage(num) {
    pageIsRendering = true;

    //get page
    pdfDoc.getPage(num).then(page => {
        // set scale
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            if (pageNumIsPending !==null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        //currentPage
        document.querySelector(".page_num").innerHTML = num;
    });

};


//check for pages rendering
function queueRenderPage(num) {
    if (pageIsRendering) {
        pageIsRendering = num;
    } else {
        displayPage(num);
    }
}

// show prev page 
function showPreviousPage() {
    if (pageNum <= 1) {
        return
    }
    pageNum--;
    queueRenderPage(pageNum);
};

// show next page 
function showNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return
    }
    pageNum++;
    queueRenderPage(pageNum);
};



//get pdf document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    console.log(pdfDoc);

    document.querySelector(".page_count").innerHTML = pdfDoc.numPages; 
    displayPage(pageNum);
});

// button events

// const btns = document.querySelectorAll(".btn");

// btns.forEach(function(btn) {
//     if (btn.classList.contains("next")) {
//         btn.addEventListener("click", showNextPage)
//     } else {
//         btn.addEventListener("click", showPreviousPage)
//     } 
// });

document.querySelector(".next").addEventListener("click", showNextPage);
document.querySelector(".prev").addEventListener("click", showPreviousPage);