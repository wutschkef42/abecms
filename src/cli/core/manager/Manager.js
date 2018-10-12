import {
  config,
} from '../../'

let Manager;

import ManagerFile from './ManagerFile'
import ManagerMongo from './ManagerMongo'

if (config.database.type == "file") {
  Manager = ManagerFile
} 
else if (config.database.type == "mongo") {
  Manager = ManagerMongo
}

export default Manager
