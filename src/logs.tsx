const msgText = (msg: string) => `\n${' '.repeat(14 - msg.length / 2)}[${msg}]`

export const contentScriptLog = (item: string) => {
  console.log(msgText(`${item} Script Loaded`))
}

export const backgroundLog = () => {
  console.log(msgText('Background Loaded'))
}
