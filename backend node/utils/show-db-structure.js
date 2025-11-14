const db = require('../database/database')

async function showDatabaseStructure() {
  console.log('🗄️ RentACar Database Structure\n')
  
  try {
    // Get all database files
    const tables = [
      'users', 'vendors', 'vehicles', 'bookings', 
      'reviews', 'maintenance', 'rewards', 'discounts',
      'conversations', 'messages', 'notifications'
    ]
    
    const structure = {}
    
    for (const table of tables) {
      try {
        const data = await db.readFile(table)
        structure[table] = {
          count: data.length,
          sample_fields: data.length > 0 ? Object.keys(data[0]) : [],
          last_updated: data.length > 0 ? data[data.length - 1].updated_at : 'N/A'
        }
      } catch (error) {
        structure[table] = {
          count: 0,
          sample_fields: [],
          last_updated: 'No data'
        }
      }
    }
    
    console.table(structure)
    
    // Show sample data for each table
    console.log('\n📊 Sample Data:\n')
    
    for (const table of tables) {
      try {
        const data = await db.readFile(table)
        if (data.length > 0) {
          console.log(`\n📋 ${table.toUpperCase()} (${data.length} records):`)
          console.table(data.slice(0, 3)) // Show first 3 records
        } else {
          console.log(`\n📋 ${table.toUpperCase()}: No data`)
        }
      } catch (error) {
        console.log(`\n📋 ${table.toUpperCase()}: Error reading data`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error reading database:', error.message)
  }
}

// Run if called directly
if (require.main === module) {
  showDatabaseStructure()
}

module.exports = { showDatabaseStructure }
