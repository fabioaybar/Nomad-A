const fs = require('fs').promises
const path = require('path')

class FileDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '../database/data')
    this.ensureDataDirectory()
  }

  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true })
    } catch (error) {
      console.error('Error creating data directory:', error)
    }
  }

  async readFile(filename) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`)
      const data = await fs.readFile(filePath, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  async writeFile(filename, data) {
    const filePath = path.join(this.dataDir, `${filename}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  }

  async findById(filename, id) {
    const data = await this.readFile(filename)
    return data.find(item => item.id === parseInt(id))
  }

  async findAll(filename, filters = {}) {
    let data = await this.readFile(filename)
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        data = data.filter(item => {
          if (typeof filters[key] === 'string') {
            return item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
          }
          return item[key] === filters[key]
        })
      }
    })
    
    return data
  }

  async create(filename, item) {
    const data = await this.readFile(filename)
    const newItem = {
      id: this.generateId(data),
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    data.push(newItem)
    await this.writeFile(filename, data)
    return newItem
  }

  async update(filename, id, updates) {
    const data = await this.readFile(filename)
    const index = data.findIndex(item => item.id === parseInt(id))
    
    if (index === -1) {
      throw new Error('Item not found')
    }
    
    data[index] = {
      ...data[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    await this.writeFile(filename, data)
    return data[index]
  }

  async delete(filename, id) {
    const data = await this.readFile(filename)
    const index = data.findIndex(item => item.id === parseInt(id))
    
    if (index === -1) {
      throw new Error('Item not found')
    }
    
    const deletedItem = data.splice(index, 1)[0]
    await this.writeFile(filename, data)
    return deletedItem
  }

  async count(filename, filters = {}) {
    const data = await this.findAll(filename, filters)
    return data.length
  }

  async paginate(filename, page = 1, limit = 10, filters = {}) {
    const data = await this.findAll(filename, filters)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    
    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: data.length,
        pages: Math.ceil(data.length / limit),
        hasNext: endIndex < data.length,
        hasPrev: page > 1
      }
    }
  }

  generateId(data) {
    if (data.length === 0) return 1
    const maxId = Math.max(...data.map(item => item.id))
    return maxId + 1
  }

  // Utility methods for specific operations
  async findByField(filename, field, value) {
    const data = await this.readFile(filename)
    return data.find(item => item[field] === value)
  }

  async findByFields(filename, fields) {
    const data = await this.readFile(filename)
    return data.filter(item => {
      return Object.keys(fields).every(key => item[key] === fields[key])
    })
  }

  async updateMany(filename, filters, updates) {
    const data = await this.readFile(filename)
    let updatedCount = 0
    
    data.forEach((item, index) => {
      const matches = Object.keys(filters).every(key => item[key] === filters[key])
      if (matches) {
        data[index] = {
          ...item,
          ...updates,
          updated_at: new Date().toISOString()
        }
        updatedCount++
      }
    })
    
    await this.writeFile(filename, data)
    return updatedCount
  }

  async deleteMany(filename, filters) {
    const data = await this.readFile(filename)
    const originalLength = data.length
    
    const filteredData = data.filter(item => {
      return !Object.keys(filters).every(key => item[key] === filters[key])
    })
    
    await this.writeFile(filename, filteredData)
    return originalLength - filteredData.length
  }
}

// Create singleton instance
const db = new FileDatabase()

module.exports = db

