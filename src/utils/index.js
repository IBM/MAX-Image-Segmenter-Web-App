import {} from 'dotenv/config'
import axios from 'axios'
import PouchDB from 'pouchdb'

const KUBE_MODEL_IP = process.env.REACT_APP_KUBE_IP
const KUBE_MODEL_PORT = process.env.REACT_APP_KUBE_MODEL_PORT
const LOCAL_MODEL_PORT = process.env.REACT_APP_LOCAL_MODEL_PORT
const DEPLOY_TYPE = process.env.REACT_APP_DEPLOY_TYPE || ''
const DBUser = process.env.REACT_APP_CLOUDANT_USER
const DBPass = process.env.REACT_APP_CLOUDANT_PW
const cloudantURL = `https://${DBUser}:${DBPass}@${DBUser}.cloudant.com/images`

let pouchDB
if (!DBUser || !DBPass) {
  pouchDB = new PouchDB('offLine')
 } else {
  pouchDB = new PouchDB(cloudantURL)
}

export const OBJ_LIST = ['background', 'airplane', 'bicycle', 'bird', 'boat', 
'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'dining_table', 
'dog', 'horse', 'motorbike', 'person', 'potted_plant', 'sheep', 
'sofa', 'train', 'tv']

let objMap = {} 
OBJ_LIST.forEach((x,i)=> objMap[x]=i)
export const OBJ_MAP = objMap

export const COLOR_MAP = {
  'green' : [0, 128, 0],
  'red' : [255, 0, 0],
  'blue' : [0, 0, 255],
  'purple' : [160, 32, 240],
  'pink' : [255, 185, 80],
  'teal' : [0, 128, 128],
  'yellow' : [255, 255, 0],
  'gray' : [192, 192, 192]
}
export const COLOR_LIST = Object.values(COLOR_MAP)

export const getAllDocs = () => {
  return pouchDB.allDocs({ include_docs : 'true', attachments: 'true' })
}

export const cleanDocs = docs => {
  return docs.rows.map(
    doc=> ({
      id: doc.doc._id, 
      width: doc.doc.width,
      height: doc.doc.height,
      segments: Object.keys(doc.doc._attachments).map(
        segName =>  ({ 
          name : segName,
          hasData : doc.doc._attachments[segName] && true,
          url: (`data:image/png;base64,${doc.doc._attachments[segName].data}`)
          }
      ))
    }))
}

export const bulkSaveAttachments = uploadData => {
  console.log(`update attachment: ${Object.keys(uploadData)} rev: ${uploadData.rev}`)
  const { urls, name, width, height } = uploadData
  const id = `${String(Date.now()).substring(6)}-${name.split('.')[0]}`
  // build attachments object
  let attachments = {}
  const segmentList = Object.keys(urls)
  for (let seg in segmentList) {
    attachments[[segmentList[seg]]] = {
      content_type : 'image/png',
      data : URLto64(urls[segmentList[seg]])
    }
  }
  console.log(attachments)
  return pouchDB.put({
    _id: id,
    name: name,
    width: width,
    height: height,
    segmentsFound: segmentList,
    _attachments : attachments
  })
} 

export const getPrediction = (modelType, img) => {
  let bodyFormData = new FormData()
  bodyFormData.set('image', img)
  bodyFormData.set('type', img.content_type)
  let modelPort
  let modelIP
  if (DEPLOY_TYPE === 'KUBE') {
    modelPort = KUBE_MODEL_PORT
    modelIP = KUBE_MODEL_IP
  } else {
    modelPort = LOCAL_MODEL_PORT
    modelIP = 'localhost'
  }
  
  return axios({
    method: 'post',
    url: `http://${modelIP}:${modelPort}/model/predict/${modelType}`,
    data: bodyFormData,
    config: { headers: { 'Content-Type' : 'multipart/form-data', 'accept' : 'application/json' } }
  })
}

export const parseMAXData = (imgName, response) => {
  const size = response.data.image_size
  const flatSegMap = response.data.seg_map.reduce((a, b) => a.concat(b), [])
  const objIDs = [...new Set(flatSegMap)] // eslint-disable-next-line
  const objPixels = flatSegMap.reduce((a, b) => (a[OBJ_LIST[b]] = ++a[OBJ_LIST[b]] || 1, a), {})

  return {
    'size' : {
      'width' : size[0],
      'height' : size[1],
      'pixels' : size[0] * size[1]
    },
    'objectTypes' : objIDs.map(x => OBJ_LIST[x]),
    'objectIDs' : objIDs,
    'objectPixels' : objPixels,
    'segMap' : response.data.seg_map,
    'flatSegMap' : flatSegMap,
    'imageName' : imgName
  }
}


// this should be placed in some kind of init function
// or component lifecycle method

export const URLto64 = dataURL => dataURL.split(',')[1]