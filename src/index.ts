
const ErrorStackParser = require('error-stack-parser')
const {SourceMapConsumer} = require('source-map')
const path = require('path')
const fs = require('fs')

export default class StackParser{
  private sourceMapDir:string
  private consumers:object
  constructor(sourceMapDir){
    this.sourceMapDir=sourceMapDir
    this.consumers={}
  }
  static parseStackTrack(stack:string,message?:string){
    const error=new Error(message)
    error.stack=stack
    const stackFrame = ErrorStackParser.parse(error)
    return stackFrame
  }
  parseOriginStackTrack(stack:string,message?:string){
    const frame = StackParser.parseStackTrack(stack,message)
    return this.getOriginalErrorStack(frame)
  }
  async getOriginalErrorStack(stackFrame:Array<object>){
    const origin = []
    for(const v of stackFrame){
      origin.push(await this.getOriginPosition(v))
    }
    return origin
  }
  async getOriginPosition(stackFrame){
    let {columnNumber,lineNumber,fileName} = stackFrame
    fileName = path.basename(fileName)
    let consumer = this.consumers[fileName]
    if(consumer===undefined){
      const sourceMapPath = path.resolve(this.sourceMapDir,fileName+'.map')
      if(!fs.existsSync(sourceMapPath)){
        return stackFrame
      }
      const content = fs.readFileSync(sourceMapPath,'utf-8')
      consumer = await new SourceMapConsumer(content,null)
      this.consumers[fileName] = consumer
    }
    const parseData = consumer.originalPositionFor({line:lineNumber,column:columnNumber})
    return parseData
  }
}