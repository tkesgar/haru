#!/usr/bin/env node
const fs = require('fs')
const Haru = require('..')

const args = process.argv.slice(2)

let h
try {
  h = Haru.fromJSON(fs.readFileSync(0))
} catch (error) {
  console.log('Failed to parse JSON from stdin')
  process.exit(1)
}

if (args.length === 0) {
  help()
}

(async () => {
  const [password] = args
  const result = await h.test(password)
  console.log(`Password: ${password}`)
  console.log(`Result: ${result}`)
})().catch(error => {
  console.log(`Failed to test password (${error.message})`)
  process.exit(1)
})

function help() {
  console.log(`
  Usage:
    haru-test <password>

  Haru JSON is read from standard input.

  Example:
    haru-test "correct horse battery staple" < haru.json
  `)
  process.exit()
}
