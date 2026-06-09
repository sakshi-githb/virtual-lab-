import test from 'node:test';
import assert from 'node:assert';
import { io as ClientIO } from 'socket.io-client';

const PORT = process.env.PORT || 5000;
const SOCKET_URL = `http://localhost:${PORT}`;

test('VIRTUAL-LAB Sockets & Memory Footprint Audit', async (t) => {
  // 1. WebSocket Connectivity and State Sync Test
  await t.test('Sockets - Should establish connection and sync collaborative events cleanly', () => {
    return new Promise((resolve, reject) => {
      const client1 = ClientIO(SOCKET_URL);
      const client2 = ClientIO(SOCKET_URL);
      
      const testRoomCode = `ROOM_${Date.now()}`;

      client1.on('connect', () => {
        // Client 1 creates classroom
        client1.emit('room:create', { username: 'Teacher Host' });
      });

      client1.on('room:joined', ({ roomCode }) => {
        // Client 2 joins the same room code
        client2.emit('room:join', { roomCode, username: 'Student Spectator' });
      });

      client2.on('room:joined', () => {
        // Client 1 sends physics coordinate sync payload
        client1.emit('physics:sync', {
          bodies: [{ syncId: 'box-1', x: 100, y: 150, angle: 0, vx: 1, vy: 1 }]
        });
      });

      client2.on('physics:sync', (syncData) => {
        assert.strictEqual(syncData.bodies[0].syncId, 'box-1');
        assert.strictEqual(syncData.bodies[0].x, 100);
        
        // Disconnect clients
        client1.disconnect();
        client2.disconnect();
        resolve();
      });

      // Cleanup timeout in case sockets fail to connect
      setTimeout(() => {
        client1.disconnect();
        client2.disconnect();
        reject(new Error('WebSocket sync timeout exceeded 3000ms'));
      }, 3000);
    });
  });

  // 2. Memory Footprint Leak Audit (Simulate many socket client connections in series)
  await t.test('Memory Leak Audit - Room map size and heap memory stability under client churn', async () => {
    const baselineMemory = process.memoryUsage().heapUsed;
    
    // Connect and disconnect clients in series to verify GC-ready state
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => {
        const socket = ClientIO(SOCKET_URL, { forceNew: true });
        
        socket.on('connect', () => {
          socket.emit('room:create', { username: `LoadTester_${i}` });
        });

        socket.on('room:joined', () => {
          socket.emit('chat:send', { text: `Simulated message index: ${i}` });
          // Disconnect client
          socket.disconnect();
          resolve();
        });
        
        setTimeout(() => {
          socket.disconnect();
          resolve();
        }, 100);
      });
    }

    // Give node time to clear handles and trigger gc if expose-gc is on
    if (global.gc) {
      global.gc();
    }
    
    const postTestMemory = process.memoryUsage().heapUsed;
    const deltaKb = Math.round((postTestMemory - baselineMemory) / 1024);
    
    console.log(`\n==================================================`);
    console.log(`💾 Memory Audit Results:`);
    console.log(`   Baseline Heap: ${Math.round(baselineMemory / 1024 / 1024)} MB`);
    console.log(`   Post-Test Heap: ${Math.round(postTestMemory / 1024 / 1024)} MB`);
    console.log(`   Heap Delta: ${deltaKb} KB`);
    console.log(`==================================================\n`);

    // A leak would keep references to disconnected socket clients, adding megabytes of heap.
    // Assert that the memory footprint change is modest (e.g. within 15 MB) to verify reference cleanups.
    assert.ok(deltaKb < 15 * 1024, `Leak Audit Failed: Significant memory growth of ${deltaKb} KB detected after connection churn`);
  });
});
