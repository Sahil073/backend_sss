const { Socket } = require('socket.io')
const roomManager = require('./reactionHandlers') 

module.exports = (io, socket) => {
    const {userId, name} = socket.user

    socket.on('room:join', async ({roomCode, userName}) => {
        try {

            socket.join(roomCode)

            await roomManager.addParticipant(roomCode, userId, {
                userName, 
                socketId: socket.id,
                isMuted: false,
                isCameraOff: false,
                isHost: false       
            })
            const participants = await roomManager.getParticipants(roomCode)
            socket.emit('room:participants', {participants})
            socket.io(roomCode).emit('room:user-joined', {
                userId,
                userName,
                isHost: false
            })
            console.log(`User ${userName} joined room ${roomCode}`)

        }catch (err) {
            console.error('room:join error:', err)
            socket.emit('error:server', {message: 'Failed to join room'})
        }

})

socket.on('room:leave', async ({roomCode}) => {
    try {
        await roomManager.removeParticipant(roomCode, userId)
        socket.leave(roomCode)
        socket.to(roomCode).emit('room:user-left', {userId, userName: name})
        console.log(`User ${name} left room ${roomCode}`)
    }catch (err) {
        console.error('room:leave error', err)
    }
})
socket.on('webrtc:offer', async ({toUserId, sdp}) => {
    try {
        const targetSocketId = await roomManager.getSocketId(
            [...socket.rooms].find(r => r !== socket.id), toUserId
        )
        if(!targetSocketId) {
            console.warn(`webrtc:offer: target user ${toUserId} not found`)
            return 
        }
        io.to(targetSocketId).emit('webrtc:offer', {
            fromUserId: userId,
            sdp
        })
    } catch (err) {
        console.error('webrtc:offer error', err)
    }
})

socket.on('webrtc:answer', async ({toUserId, sdp}) => {
    try {
        const roomCode = [...socket.rooms].find(r => r !== socket.id)
        const targetSocketId = await roomManager.getSocketId(roomCode, toUserId)
        if(!targetSocketId) return
      io.to(targetSocketId).emit('webrtc:answer', {
        fromUserId: userId,
        sdp
    })
}catch (err) {
    console.error('webrtc:answer error:', err)
}
})

socket.on('webrtc:ice-candidate', async ({ toUserId, candidate }) => {
    try {
      const roomCode = [...socket.rooms].find(r => r !== socket.id)
      const targetSocketId = await roomManager.getSocketId(roomCode, toUserId)

      if (!targetSocketId) return

      io.to(targetSocketId).emit('webrtc:ice-candidate', {
        fromUserId: userId,
        candidate
      })
    } catch (err) {
      console.error('webrtc:ice-candidate error:', err)
    }
  })



  socket.on('media:mute-toggle', async ({ roomCode, isMuted }) => {
    try {

      await roomManager.updateParticipant(roomCode, userId, { isMuted })

      io.to(roomCode).emit('media:state-changed', { userId, isMuted })
    } catch (err) {
      console.error('media:mute-toggle error:', err)
    }
  })

  socket.on('media:camera-toggle', async ({ roomCode, isCameraOff }) => {
    try {
      await roomManager.updateParticipant(roomCode, userId, { isCameraOff })
      io.to(roomCode).emit('media:state-changed', { userId, isCameraOff })
    } catch (err) {
      console.error('media:camera-toggle error:', err)
    }
  })

 // host babua ke adhikar

  socket.on('host:mute-all', async ({ roomCode }) => {
    try {
      const participants = await roomManager.getParticipants(roomCode)


      const sender = participants.find(p => p.userId === userId)
      if (!sender || !sender.isHost) {
        socket.emit('error:unauthorized', { message: 'Only the host can mute all' })
        return
      }


      for (const participant of participants) {
        if (participant.userId !== userId) {
          await roomManager.updateParticipant(roomCode, participant.userId, { isMuted: true })
        }
      }

      io.to(roomCode).emit('host:all-muted', { mutedBy: userId })
    } catch (err) {
      console.error('host:mute-all error:', err)
    }
  })

  socket.on('host:remove-participant', async ({ roomCode, targetUserId }) => {
    try {
      const participants = await roomManager.getParticipants(roomCode)
      const sender = participants.find(p => p.userId === userId)

      if (!sender || !sender.isHost) {
        socket.emit('error:unauthorized', { message: 'Only the host can remove participants' })
        return
      }


      const target = participants.find(p => p.userId === targetUserId)
      if (!target) return


      io.to(target.socketId).emit('you:were-removed', {
        message: 'You were removed from the meeting by the host'
      })

     
      await roomManager.removeParticipant(roomCode, targetUserId)


      socket.to(roomCode).emit('room:user-left', {
        userId: targetUserId,
        userName: target.userName
      })


      const targetSocket = io.sockets.sockets.get(target.socketId)
      if (targetSocket) {
        targetSocket.leave(roomCode)
      }
    } catch (err) {
      console.error('host:remove-participant error:', err)
    }
  })

  socket.on('host:end-meeting', async ({ roomCode }) => {
    try {
      const participants = await roomManager.getParticipants(roomCode)
      const sender = participants.find(p => p.userId === userId)

      if (!sender || !sender.isHost) {
        socket.emit('error:unauthorized', { message: 'Only the host can end the meeting' })
        return
      }


      io.to(roomCode).emit('meeting:ended', {
        endedBy: userId,
        message: 'The host has ended the meeting'
      })

  
      await roomManager.deleteRoom(roomCode)

      console.log(`Meeting ${roomCode} ended by host ${name}`)
    } catch (err) {
      console.error('host:end-meeting error:', err)
    }
  })

  socket.on('disconnect', async () => {
    try {

      const rooms = [...socket.rooms].filter(r => r !== socket.id)

      for (const roomCode of rooms) {
        await roomManager.removeParticipant(roomCode, userId)

        
        socket.to(roomCode).emit('room:user-left', {
          userId,
          userName: name
        })
      }

      console.log(`Socket disconnected: ${socket.id} (user: ${name})`)
    } catch (err) {
      console.error('disconnect cleanup error:', err)
    }
  })
}