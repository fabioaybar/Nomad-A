const { exec } = require('child_process')
const os = require('os')

const PORT = process.env.PORT || 8000

function killPort(port) {
  return new Promise((resolve, reject) => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      // Windows command
      command = `netstat -ano | findstr :${port}`
    } else {
      // Unix/Linux/Mac command
      command = `lsof -ti:${port}`
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        // Port might not be in use, which is fine
        console.log(`Port ${port} is available`)
        resolve()
        return
      }

      if (platform === 'win32') {
        // Parse Windows output
        const lines = stdout.trim().split('\n')
        const pids = []
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 5) {
            const pid = parts[4]
            if (pid && pid !== '0' && !pids.includes(pid)) {
              pids.push(pid)
            }
          }
        })

        if (pids.length === 0) {
          console.log(`Port ${port} is available`)
          resolve()
          return
        }

        // Kill each process
        let killCount = 0
        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, (killError) => {
            killCount++
            if (killError) {
              console.log(`Could not kill process ${pid}: ${killError.message}`)
            } else {
              console.log(`Killed process ${pid} on port ${port}`)
            }
            
            if (killCount === pids.length) {
              console.log(`Port ${port} is now available`)
              resolve()
            }
          })
        })
      } else {
        // Unix/Linux/Mac
        const pids = stdout.trim().split('\n').filter(pid => pid.trim())
        
        if (pids.length === 0) {
          console.log(`Port ${port} is available`)
          resolve()
          return
        }

        // Kill each process
        let killCount = 0
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, (killError) => {
            killCount++
            if (killError) {
              console.log(`Could not kill process ${pid}: ${killError.message}`)
            } else {
              console.log(`Killed process ${pid} on port ${port}`)
            }
            
            if (killCount === pids.length) {
              console.log(`Port ${port} is now available`)
              resolve()
            }
          })
        })
      }
    })
  })
}

// Run the port killer
console.log(`Checking port ${PORT}...`)
killPort(PORT)
  .then(() => {
    console.log(`Ready to start server on port ${PORT}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error(`Error killing port ${PORT}:`, error)
    process.exit(1)
  })
