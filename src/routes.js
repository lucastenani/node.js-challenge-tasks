import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { q } = req.query
      const tasks = database.select(
        'tasks',
        q
          ? {
              title: q,
              description: q,
            }
          : null,
      )

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const { title, description } = req.body

        if (!title || !description) {
          throw new Error()
        }

        const task = {
          title,
          description,
          completed_at: null,
        }

        database.insert('tasks', task)

        return res.writeHead(201).end()
      } catch (error) {
        return res.writeHead(400).end()
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params
        const { title, description } = req.body

        if (!title || !description) {
          throw new Error()
        }

        const task = {
          title,
          description,
        }

        database.update('tasks', id, task)

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        database.delete('tasks', id)

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        database.complete('tasks', id)

        return res.end()
      } catch (error) {
        return res.writeHead(400).end(error.message)
      }
    },
  },
]
