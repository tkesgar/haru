#!/usr/bin/env node
const Haru = require('..')

const args = process.argv.slice(2)

if (args.length === 0) {
  help()
}

(async () => {
  const [password, argSalt, argCost] = args

  const callArgs = [password]
  if (argSalt) {
    callArgs.push(Buffer.from(argSalt, 'base64'))
  }
  if (argCost) {
    callArgs.push(Number.parseFloat(argCost))
  }

  const result = await Haru.fromPassword(...callArgs)
  console.log(result.toString())
})().catch(error => {
  console.log(`Failed to create hash (${error.message})`)
  process.exit(1)
})

function help() {
  console.log(`
  Usage:
    haru-pass <password> [salt] [cost]

  If salt is not provided, a random 16-bytes salt will be generated.
  If cost is not provided, the number 1 will be used.

  Example:
    haru-pass "correct horse battery staple"
  `)
  process.exit()
}
