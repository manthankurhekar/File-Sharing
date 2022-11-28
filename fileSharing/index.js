const dropZone = document.querySelector('.drop-zone')
const fileInput = document.querySelector('#fileinput')
const browseBtn = document.querySelector('.browseBtn')
const bgProgress = document.querySelector('.bg-progress')
const percentDiv = document.querySelector('#persent')
const progressbar = document.querySelector('.progress-bar')
const progressContainer = document.querySelector('.progress-continer')
const fileURL = document.querySelector('#fileURL')
const sharingcontainer = document.querySelector('.sharing-container')
const copyBtn = document.querySelector('#copy-btn')
const toast = document.querySelector('.toast')

const maxFileAllowed = 100 * 1024 * 1024

const baseURL = "https://votishare-anuragsharna.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;
// const emailURL = `${baseURL}/api/files/send`;

dropZone.addEventListener('dragover',(e)=>{
    e.preventDefault()

    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged')
    }

})

dropZone.addEventListener('dragleave',()=>{
    dropZone.classList.remove('dragged')
})

dropZone.addEventListener('drop',(e)=>{
    e.preventDefault()
    dropZone.classList.remove('dragged')
    const files = e.dataTransfer.files 
    console.log(files)
    if (files.length) {
        fileInput.files = files
        uploadFiles()
    }
})

fileInput.addEventListener('change',()=>{
    uploadFiles()
})

browseBtn.addEventListener("click",(e)=>{
    fileInput.click() 
})
copyBtn.addEventListener('click',(e)=>{
    fileURL.select()
    document.execCommand("copy")
    showToast("Copy to clipboard")
})

const uploadFiles = () =>{

    
    if (fileInput.files.length > 1) {
        fileInput.value = ""
        showToast("Upload only one file")
        return
    }
    const file = fileInput.files[0]
    if (file.size > maxFileAllowed) {
        fileInput.value = ""
        showToast("Cannot upload more then 100MB")
    }
    
    
    progressContainer.style.display = "block"
    const formData = new FormData()
    formData.append("myfile",file)


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{
        // console.log(xhr.readyState)
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response)
            showLink(JSON.parse(xhr.response))
        }
    }

    xhr.upload.onprogress = updateProgress; 

    xhr.upload.onerror = ()=>{
        fileInput.value = ""
        showToast(`Error in upload : ${xhr.statusText}`)
    }

    xhr.open('POST',uploadURL)
    xhr.send(formData)
}

const updateProgress = (e)=>{

    const persent =Math.round((e.loaded / e.total)*100)
    // console.log(e)
    // console.log(persent)

    bgProgress.style.width = `${persent}%`
    percentDiv.innerText = persent
    progressbar.style.transform = `scaleX(${persent/100})`
}

const showLink = ({file: url})=>{
    console.log(url)
    progressContainer.style.display = 'none'
    sharingcontainer.style.display = 'block'
    fileURL.value = url
}
let tostTimer;

const showToast=(msg)=>{
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)"
    clearTimeout(tostTimer)
    tostTimer = setTimeout(() => {    
        toast.style.transform = "translate(-50%,60px)"
    }, 2000);
}