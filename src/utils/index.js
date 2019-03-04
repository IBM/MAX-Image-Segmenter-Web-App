import {} from 'dotenv/config'
import * as tf from '@tensorflow/tfjs'
import axios from 'axios'
import PouchDB from 'pouchdb'
import { saveAs } from 'file-saver'
import B64toBlob  from 'b64-to-blob'

const KUBE_MODEL_IP = process.env.REACT_APP_KUBE_IP || ''
const KUBE_MODEL_PORT = process.env.REACT_APP_KUBE_MODEL_PORT || ''
const LOCAL_MODEL_PORT = process.env.REACT_APP_LOCAL_MODEL_PORT || 5000
const DEPLOY_TYPE = process.env.REACT_APP_DEPLOY_TYPE || ''
const MODEL_PATH = 'https://raw.githubusercontent.com/kastentx/tfjs-conversion/master/second-try/tensorflowjs_model.pb'
const WEIGHTS_PATH = 'https://raw.githubusercontent.com/kastentx/tfjs-conversion/master/second-try/weights_manifest.json'

export const loadTFJSModel = () => tf.loadFrozenModel(MODEL_PATH, WEIGHTS_PATH)

export const MAX_SIZE = process.env.REACT_APP_DEPLOY_TYPE || 513

export const OBJ_LIST = ['background', 'airplane', 'bicycle', 'bird', 'boat', 
'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'dining table', 
'dog', 'horse', 'motorbike', 'person', 'potted plant', 'sheep', 
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
  return image.id.split('-')[1] || image.id
}

export const getScaledSize = ({ height, width }) => {
  if (width > height) {
    return {
      scaledWidth: MAX_SIZE,
      scaledHeight: Math.round((height / width) * MAX_SIZE)
    }
  } else {
    return {
      scaledWidth: Math.round((width / height) * MAX_SIZE),
      scaledHeight: MAX_SIZE
    }
  }
}

export const isNonEmpty = obj => {
  return obj && Object.keys(obj).length !== 0
}

export const isEmpty = obj => {
  return !isNonEmpty(obj)
}

export const getAllDocs = () => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.allDocs({ include_docs: 'true', attachments: 'true' })
}

export const deleteAllImages = () => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.destroy()
}

export const deleteSingleImage = image => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  return pouchDB.remove(image.id, image.rev) 
}

export const cleanDocs = docs => {
  return docs.rows.map(
    doc=> {
      const segList = Object.keys(doc.doc._attachments)
      let segObject = {}
      for (let seg of segList) {
        segObject[seg] = { 
          name: seg,
          hasData: doc.doc._attachments[seg] && true,
          url: B64toURL(doc.doc._attachments[seg].data)
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

export const getSingleImage = imageID => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })

  return pouchDB.get(imageID, { include_docs: true, attachments: true })
} 

export const saveToPouch = uploadData => {
  const pouchDB = new PouchDB('offLine', { auto_compaction: true })
  const { urls, name, width, height } = uploadData
  const id = `${String(Date.now()).substring(6)}-${name.split('.')[0]}`
  let attachments = {}
  const segmentList = Object.keys(urls)
  for (let seg of segmentList) {
    attachments = {
      ...attachments,
      [seg]: {
        content_type: 'image/png',
        data: URLtoB64(urls[seg])
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
  }, { include_docs: true })
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
    config: { headers: { 'Content-Type' : 'multipart/form-data', 'accept' : 'application/json' }, timeout: 8000 }
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

export const cleanTFJSResponse = (image, modelOutput) => {
  const objIDs = [...new Set(modelOutput)] // eslint-disable-next-line
  const objPixels = modelOutput.reduce((a, b) => (a[OBJ_LIST[b]] = ++a[OBJ_LIST[b]] || 1, a), {})
  const objTypes = objIDs.map(x => OBJ_LIST[x])
  return {
    foundSegments: objTypes.concat('colormap'),
    response: {
      size: {
        width: image.width,
        height: image.height,
        pixels: image.height * image.width
      },
      objectTypes: objTypes,
      objectIDs: objIDs,
      objectPixels: objPixels,
      flatSegMap: modelOutput,
      imageName: image.name
    }
  }
}

const downloadSingleSeg = (imgName, segment) => {
  saveAs(B64toBlob(URLtoB64(segment.url), 'image/png'), `${ imgName }-${ segment.name }.png`)
}

export const downloadSegments = ({ id, segments }) => Object.keys(segments)
  .forEach(seg => downloadSingleSeg(id.split('-')[1], segments[seg]))
