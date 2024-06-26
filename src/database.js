import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  #generateTimestamps() {
    const now = new Date()
    return {
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    }
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  insert(table, data) {
    const timestamps = this.#generateTimestamps()
    const id = randomUUID()
    const record = { id, ...data, ...timestamps }

    Array.isArray(this.#database[table])
      ? this.#database[table].push(record)
      : (this.#database[table] = [record])

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else {
      throw new Error()
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const currentRecord = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = {
        ...currentRecord,
        ...data,
        updated_at: new Date().toISOString(),
      }

      this.#persist()
    } else {
      throw new Error()
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      const currentRecord = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = {
        ...currentRecord,
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }

      this.#persist()
    } else {
      throw new Error()
    }
  }
}
