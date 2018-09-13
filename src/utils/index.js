import {} from 'dotenv/config'
import axios from 'axios'
import PouchDB from 'pouchdb'
import { saveAs } from 'file-saver/FileSaver'
import B64toBlob  from 'b64-to-blob'

const KUBE_MODEL_IP = process.env.REACT_APP_KUBE_IP || ''
const KUBE_MODEL_PORT = process.env.REACT_APP_KUBE_MODEL_PORT || ''
const LOCAL_MODEL_PORT = process.env.REACT_APP_LOCAL_MODEL_PORT || 5000
const DEPLOY_TYPE = process.env.REACT_APP_DEPLOY_TYPE || ''

export const MAX_SIZE = process.env.REACT_APP_DEPLOY_TYPE || 513

export const OBJ_LIST = ['background', 'airplane', 'bicycle', 'bird', 'boat', 
'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'dining_table', 
'dog', 'horse', 'motorbike', 'person', 'potted_plant', 'sheep', 
'sofa', 'train', 'tv']

let objMap = {} 
OBJ_LIST.forEach((x,i)=> objMap[x]=i)
export const OBJ_MAP = objMap

export const COLOR_MAP = {
  green: [0, 128, 0],
  red: [255, 0, 0],
  blue: [0, 0, 255],
  purple: [160, 32, 240],
  pink: [255, 185, 80],
  teal: [0, 128, 128],
  yellow: [255, 255, 0],
  gray: [192, 192, 192]
}
export const COLOR_LIST = Object.values(COLOR_MAP)

export const getColor = pixel => COLOR_LIST[pixel - 1]

export const B64toURL = base64 => `data:image/png;base64,${base64}`

export const URLtoB64 = dataURL => dataURL.split(',')[1]

export const getFormattedName = image => {
  return image.id.split('-')[1]
}

export const getAllDocs = () => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.allDocs({ include_docs: 'true', attachments: 'true' })
}

export const deleteAllImages = () => {
  console.log(`bulk delete`)
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.destroy()
}

export const deleteSingleImage = image => {
  console.log(`delete ${ image.id }`)
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.remove(image.id, image.rev) 

}

export const cleanDocs = docs => {
  return docs.rows.map(
    doc=> {
      const segList = Object.keys(doc.doc._attachments)
      let segObject = {}
      for (let seg in segList) {
        segObject[segList[seg]] = { 
          name: segList[seg],
          hasData: doc.doc._attachments[segList[seg]] && true,
          url: B64toURL(doc.doc._attachments[segList[seg]].data)
        }
      }
      return {
        id: doc.doc._id,
        rev: doc.value.rev,
        width: doc.doc.width,
        height: doc.doc.height,
        segments: segObject
      }
    }
  )
}

export const saveToPouch = uploadData => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  const { urls, name, width, height } = uploadData
  const id = `${String(Date.now()).substring(6)}-${name.split('.')[0]}`
  // build attachments object
  let attachments = {}
  const segmentList = Object.keys(urls)
  for (let seg in segmentList) {
    attachments = {
      ...attachments,
      [segmentList[seg]]: {
        content_type: 'image/png',
        data: URLtoB64(urls[segmentList[seg]])
      }
    }
  }
  return pouchDB.put({
    _id: id,
    name: name,
    width: width,
    height: height,
    segmentsFound: segmentList,
    _attachments : attachments
  })
} 

export const getPrediction = img => {
  let modelPort
  let modelIP
  let bodyFormData = new FormData()
  bodyFormData.set('image', img)
  bodyFormData.set('type', img.content_type)
  if (DEPLOY_TYPE === 'KUBE') {
    modelPort = KUBE_MODEL_PORT
    modelIP = KUBE_MODEL_IP
  } else {
    modelPort = LOCAL_MODEL_PORT
    modelIP = 'localhost'
  }
  return axios({
    method: 'post',
    url: `http://${modelIP}:${modelPort}/model/predict`,
    data: bodyFormData,
    config: { headers: { 'Content-Type' : 'multipart/form-data', 'accept' : 'application/json' } }
  })
}

export const cleanMAXResponse = (imgName, response) => {
  const size = response.data.image_size
  const flatSegMap = response.data.seg_map.reduce((a, b) => a.concat(b), [])
  const objIDs = [...new Set(flatSegMap)] // eslint-disable-next-line
  const objPixels = flatSegMap.reduce((a, b) => (a[OBJ_LIST[b]] = ++a[OBJ_LIST[b]] || 1, a), {})
  const objTypes = objIDs.map(x => OBJ_LIST[x])
  return {
    foundSegments: objTypes.concat('colormap'),
    response: {
      size: {
        width: size[0],
        height: size[1],
        pixels: size[0] * size[1]
      },
      objectTypes: objTypes,
      objectIDs: objIDs,
      objectPixels: objPixels,
      segMap: response.data.seg_map,
      flatSegMap: flatSegMap,
      imageName: imgName
    }
  }
}

const downloadSingleSeg = (imgName, segment) => {
  saveAs(B64toBlob(URLtoB64(segment.url), 'image/png'), `${ imgName }-${ segment.name }.png`)
}

export const downloadSegments = async ({ id, segments }) => {
  for (let seg in segments) {
    downloadSingleSeg(id.split('-')[1], segments[seg])
  }
}
