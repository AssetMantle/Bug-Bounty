import { fromHex, toHex, toUtf8 } from '@cosmjs/encoding'
import base64url from 'base64url'
import { sha256 as jsSha256 } from 'js-sha256'
const generateHashID = (...args) => {
  // console.log('inside generateHashID, args: ', args)
  let hexArrayList = []
  // append all arrays (as hex values) into the empty array
  args.forEach((arg) => {
    if (arg?.length > 0) hexArrayList.push(toHex(arg))
  })

  // if hexAraryList is empty, return an empty array
  if (hexArrayList.length == 0) return hexArrayList

  // sort the array in ascending order
  let sortedHexArrayList = hexArrayList.sort()
  // join it back to a single array
  let sortedUint8ArrayList = sortedHexArrayList.map((hexArray) => fromHex(hexArray))
  let joinedUint8Array = sortedUint8ArrayList.reduce(
    (finalArray, valueArray) => [...finalArray, ...valueArray],
    []
  )
  const hexOfJoinedArray = jsSha256(joinedUint8Array)
  return fromHex(hexOfJoinedArray)
}

const toBase64Url = (uint8Array) => base64url(uint8Array) + '='

const getKeyUint8ArrayList = (propertiesArray) => {
  const filteredPropertiesArray = propertiesArray?.filter(
    (property) => (property?.key ?? property?.key) && (property?.type ?? property?.type)
  )
  const keyByteList = filteredPropertiesArray?.map((property) => {
    const keyUint8Array = toUtf8(property?.key)
    const valueUint8Array = toUtf8(property?.type)
    const keyValueUint8Array = new Uint8Array([...keyUint8Array, ...valueUint8Array])
    return keyValueUint8Array
  })
  return keyByteList
}

const getValueUint8ArrayList = (propertiesArray) => {
  // console.log('inside getValueUint8ArrayList, propertiesArray: ', propertiesArray)
  const filteredPropertiesArray = propertiesArray?.filter(
    (property) => property?.value ?? property?.value
  )

  // console.log('filteredPropertiesArray: ', filteredPropertiesArray)

  if (filteredPropertiesArray.length == 0) return filteredPropertiesArray

  // console.log('filteredArray: ', filteredPropertiesArray)
  const defaultValueUint8ArrayList = filteredPropertiesArray?.map((property) =>
    generateHashID(toUtf8(property?.value))
  )

  // console.log('defaultValueUint8ArrayList: ', defaultValueUint8ArrayList)
  return generateHashID(...defaultValueUint8ArrayList)
}

const stringToProperties = (strValue) => {
  const strPropertiesArray = strValue?.toString()?.split(',')
  const propertyArray = strPropertiesArray?.map((strProperty) => {
    const strPropertyBits = strProperty?.toString()?.split(':')
    const valuePropertyBits = strPropertyBits?.[1]?.toString()?.split('|')
    const property = {
      key: strPropertyBits?.[0],
      type: valuePropertyBits?.[0],
      value: valuePropertyBits?.[1],
    }
    return property
  })
  return propertyArray
}

const propertiesToString = (propertiesArray) => {
  const propertiesStr = propertiesArray?.reduce((aggregate, currentValue, currentIndex, array) => {
    let aggregateStr =
      aggregate + currentValue?.key + ':' + currentValue?.type + '|' + currentValue?.value
    return currentIndex < array.length - 1 ? aggregateStr + ',' : aggregateStr
  }, '')
  return propertiesStr
}


export const getClassificationID = (definitionObject) => {
  // console.log('inside getClassificationID')
  // get the byte array of the key list of immutable properties
  let immutableMesaPropertyList =
    stringToProperties(definitionObject?.value?.immutableProperties) || []
  let immutableMetaPropertyList =
    stringToProperties(definitionObject?.value?.immutableMetaProperties) || []
  let immutablePropertyList = [...immutableMesaPropertyList, ...immutableMetaPropertyList]
  console.log('immutablePropertyList: ', immutablePropertyList)

  let immutableKeyArrayList = getKeyUint8ArrayList(immutablePropertyList)
  console.log('immutableKeyArrayList: ', immutableKeyArrayList)

  // get the byte array of the key list of mutable properties
  let mutableMesaPropertyList = stringToProperties(definitionObject?.value?.mutableProperties) || []
  let mutableMetaPropertyList =
    stringToProperties(definitionObject?.value?.mutableMetaProperties) || []
  let mutablePropertyList = [...mutableMesaPropertyList, ...mutableMetaPropertyList]
  console.log('mutablePropertyList: ', mutablePropertyList)
  let mutableKeyArrayList = getKeyUint8ArrayList(mutablePropertyList)
  console.log('mutableKeyArrayList: ', mutableKeyArrayList)

  // get the byte array of the default value list of immutable properties

  let immutableValueArrayList = getValueUint8ArrayList(immutablePropertyList)

  let hashImmutableKeyArrayList = generateHashID(...immutableKeyArrayList)
  let hashMutableKeyArrayList = generateHashID(...mutableKeyArrayList)
  // use generateHashID function to calculate the classification ID in Uint8Array Format
  const classificationID = generateHashID(
    hashImmutableKeyArrayList,
    hashMutableKeyArrayList,
    immutableValueArrayList
  )

  // console.log('hashImmutableKeyArrayList: ', hashImmutableKeyArrayList)
  // console.log('hashMutableKeyArrayList: ', hashMutableKeyArrayList)
  // console.log('immutableValueArrayList: ', immutableValueArrayList)
  console.log('classificationID: ', classificationID)

  // return the base64 encoded format of classificationID
  return toBase64Url(classificationID)
}

export const getEntityID = (issueObject) => {
  // console.log('inside getEntityID')
  // get the classification ID from the issueObject and convert it to Uint8Array
  let classificationIDUint8Array = new Uint8Array(
    base64url.toBuffer(issueObject?.value?.classificationID)
  )
  // console.log('classificationIDUint8Array: ', classificationIDUint8Array)

  // get the byte array of the key list of immutable properties
  let immutableMesaPropertyList = stringToProperties(issueObject?.value?.immutableProperties) || []
  let immutableMetaPropertyList =
    stringToProperties(issueObject?.value?.immutableMetaProperties) || []
  let immutablePropertyList = [...immutableMesaPropertyList, ...immutableMetaPropertyList]
  // console.log('immutablePropertyList: ', immutablePropertyList)

  let immutableValueArrayList = getValueUint8ArrayList(immutablePropertyList)
  // console.log('immutableValueArrayList: ', immutableValueArrayList)

  // use generateHashID function to calculate the entity ID in Uint8Array Format
  const entityID = generateHashID(classificationIDUint8Array, immutableValueArrayList)

  // return the base64 encoded format of entityID
  return toBase64Url(entityID)
}

export const getNubIdentityID = (nubID) => {
  // console.log('inside getNubIdentityID')
  const classificationIDUint8Array = base64url.toBuffer(
    'DtqQ0fXQ45Bm0eavjtbwg3GSHGP-6ylMIILn6WmkY5Y='
  )
  // console.log('classificationIDUint8Array: ', new Uint8Array(classificationIDUint8Array))
  const nubIDHashUintArray = generateHashID(generateHashID(toUtf8(nubID)))
  // console.log('immutableValueArrayList: ', nubIDHashUintArray)
  let nubIdentityID = generateHashID(nubIDHashUintArray, classificationIDUint8Array)
  return toBase64Url(nubIdentityID)
}

// ---------------------------------------------

/* Functions to use: 

1. getNubIdentityID(nubID)
2. getClassificationID(definitionObject)
3. getEntityID(entityObject) (to get the ID or Assets or Identities)

create a nubID, definitionObject or entityObject and execute any one of the above functions below



// test phase, add your entity definitions here 

// correct Classification ID: xuyPBH-VaAtiY-crFwTDPjoQU56Cx28AcVHbte4K4NY=
const entityDefinitionObject = {
  classificationID: 'xuyPBH-VaAtiY-crFwTDPjoQU56Cx28AcVHbte4K4NY=',
  value: {
    baseReq: {
      from: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
      chain_id: 'test-chain-1',
    },
    type: 'asset',
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    mutableProperties: 'D:S|',
    immutableProperties: 'B:S|',
    mutableMetaProperties: 'C:S|,supply:D|',
    immutableMetaProperties: 'A:S|a',
  },
}

// correct Classification ID: qt24iLAgD4h9V0_ST1-OKn8kpILZQ5BONEc9ILhnq5k=
const entityDefinitionObject2 = {
  type: 'github.com/AssetMantle/modules/modules/identities/internal/transactions/define/transactionRequest',
  classificationID: 'qt24iLAgD4h9V0_ST1-OKn8kpILZQ5BONEc9ILhnq5k=',
  value: {
    baseReq: {
      from: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
      chain_id: 'test-chain-1',
    },
    type: 'identity',
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    mutableProperties: 'D:S|,authentication:L|',
    immutableProperties: 'B:S|',
    mutableMetaProperties: 'C:S|',
    immutableMetaProperties: 'A:S|a',
  },
}

const entityDefinitionObject3 = {
  type: 'github.com/AssetMantle/modules/modules/orders/internal/transactions/define/transactionRequest',
  classificationID: 'XJOYgfgnyIIGa-qnZMun-FDECTY_fkbZ89wVkuLzSKU=',
  value: {
    baseReq: {
      from: '${__property(first_acc_addr)}',
      chain_id: '${chain_id}',
    },
    type: 'order',
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    mutableProperties: 'H:S|h',
    immutableProperties: 'F:S|f,makerID:I|',
    mutableMetaProperties: 'G:S|g,expiryHeight:H|,makerOwnableSplit:D|0.000000000000000001',
    immutableMetaProperties:
      'E:S|e,creationHeight:H|,exchangeRate:D|,makerOwnableID:I|,takerID:I|,takerOwnableID:I|',
  },
}

const entityDefinitionObject4 = {
  type: 'github.com/AssetMantle/modules/modules/orders/internal/transactions/define/transactionRequest',
  classificationID: '??=',
  value: {
    baseReq: {
      from: '${__property(first_acc_addr)}',
      chain_id: '${chain_id}',
    },
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    mutableProperties: 'H:S|h',
    immutableProperties: 'F:S|f',
    mutableMetaProperties: 'G:S|g,randomProp:D|',
    immutableMetaProperties: 'E:S|e',
  },
}

// -------------------------------------------------

// correct Entity ID: mbil64D0TJZScClVWQLe8JlrmtqkTO6pMul9zfLFlBE=
const entityIssueObject = {
  type: 'github.com/AssetMantle/modules/modules/assets/internal/transactions/mint/transactionRequest',
  entityID: 'mbil64D0TJZScClVWQLe8JlrmtqkTO6pMul9zfLFlBE=',
  value: {
    baseReq: {
      from: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
      chain_id: "test-chain-1'",
    },
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    toID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    classificationID: 'xuyPBH-VaAtiY-crFwTDPjoQU56Cx28AcVHbte4K4NY=',
    mutableProperties: 'D:S|d',
    immutableProperties: 'B:S|b',
    mutableMetaProperties: 'C:S|c,supply:D|100',
    immutableMetaProperties: 'A:S|a',
  },
}

// correct Entity ID: RMwY6OWO3HK1WZH7BZ7Unx2_QC0J26h7IZPN_5w4OXk=
const entityIssueObject2 = {
  type: 'github.com/AssetMantle/modules/modules/identities/internal/transactions/issue/transactionRequest',
  entityID: 'RMwY6OWO3HK1WZH7BZ7Unx2_QC0J26h7IZPN_5w4OXk=',
  value: {
    baseReq: {
      from: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
      chain_id: 'test-chain-1',
    },
    to: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    classificationID: 'qt24iLAgD4h9V0_ST1-OKn8kpILZQ5BONEc9ILhnq5k=',
    mutableProperties: 'D:S|d',
    immutableProperties: 'B:S|b',
    mutableMetaProperties: 'C:S|c',
    immutableMetaProperties: 'A:S|a',
  },
}

const entityIssueObject3 = {
  type: 'github.com/AssetMantle/modules/modules/assets/internal/transactions/mint/transactionRequest',
  entityID: '#',
  value: {
    baseReq: {
      from: 'mantle1yvzrq52efeley8e2l0dqtq2xwn7q07kkg0r3hq',
      chain_id: "test-chain-1'",
    },
    fromID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    classificationID: 'XJOYgfgnyIIGa-qnZMun-FDECTY_fkbZ89wVkuLzSKU=',
    mutableProperties: 'H:S|h',
    immutableProperties:
      'F:S|f,makerID:I|Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=,makerOwnableID:I|mbil64D0TJZScClVWQLe8JlrmtqkTO6pMul9zfLFlBE=,takerID:I|Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
    mutableMetaProperties: 'G:S|g,expiryHeight:H|100014,makerOwnableSplit:D|1.000000000000000000',
    immutableMetaProperties:
      'E:S|e,creationHeight:H|14,exchangeRate:D|1000000000000000000.000000000000000000,takerOwnableID:I|stake',
  },
}

const nubIDDefinitionObject = {
  classificationID: 'DtqQ0fXQ45Bm0eavjtbwg3GSHGP-6ylMIILn6WmkY5Y=',
  value: {
    immutableMetaProperties: 'nubID:I|',
    mutableProperties: 'authentication:L|',
  },
}

const nubIDIssueObject = {
  entityID: 'Lkj8sS7M1GMTZT65lJ6K_1vfK5uT8C39icnvHMfQ5RA=',
  value: {
    classificationID: 'DtqQ0fXQ45Bm0eavjtbwg3GSHGP-6ylMIILn6WmkY5Y=',
    immutableMetaProperties: 'nubID:S|deepanshutr',
    mutableProperties: 'authentication:L|??',
  },
}

console.log('generated Classification ID: ', getClassificationID(entityDefinitionObject3))
console.log('correct   Classification ID: ', entityDefinitionObject3.classificationID)
// console.log('hashID of h: ', generateHashID(toUtf8('h')))

console.log('generated Entity ID: ', getEntityID(entityIssueObject3))
console.log('correct   Entity ID: ', entityIssueObject3.entityID)

*/
