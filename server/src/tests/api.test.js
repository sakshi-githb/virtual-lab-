import test from 'node:test';
import assert from 'node:assert';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

test('VIRTUAL-LAB API Integration Tests Suite', async (t) => {
  let authToken = null;
  let testExperimentId = null;
  const testEmail = `test_student_${Date.now()}@example.com`;
  const testPassword = 'securepassword123';

  // 1. Health Heartbeat Test
  await t.test('GET /health - Should verify that the backend API is online', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.service, 'VIRTUAL-LAB Backend API');
  });

  // 2. User Registration Test
  await t.test('POST /api/auth/register - Should register a new credentials profile', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: testEmail,
        password: testPassword
      })
    });
    
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.token, 'Registration should return a token');
    assert.strictEqual(data.user.email, testEmail);
    authToken = data.token;
  });

  // 3. User Login Test
  await t.test('POST /api/auth/login - Should authenticate credentials and return JWT', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token, 'Login should return a token');
    assert.strictEqual(data.user.email, testEmail);
  });

  // 4. Experiment Library Persistence Tests
  if (authToken) {
    await t.test('POST /api/experiments - Should save custom sandbox layout payload', async () => {
      const mockLayout = {
        title: 'Test Integration Sandbox',
        description: 'Auto-generated layout for API assertion checks',
        gravityY: 1.0,
        bodies: [
          {
            syncId: 'test-box-id',
            labelName: 'Standard Box',
            shapeType: 'box',
            x: 200,
            y: 300,
            width: 50,
            height: 50,
            mass: 2.5,
            friction: 0.1,
            restitution: 0.5,
            isStatic: false,
            color: '#FACC15'
          }
        ],
        constraints: [
          {
            bodyAId: 'test-box-id',
            bodyBId: null,
            pointA: { x: 0, y: 0 },
            pointB: { x: 200, y: 100 },
            length: 150,
            stiffness: 1,
            damping: 0,
            color: '#1A1A1A',
            lineWidth: 3,
            label: 'Cable'
          }
        ]
      };

      const res = await fetch(`${BASE_URL}/api/experiments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(mockLayout)
      });

      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.experiment.title, 'Test Integration Sandbox');
      assert.ok(data.experiment._id, 'Saved layout should have an ObjectId');
      assert.strictEqual(data.experiment.constraints.length, 1);
      assert.strictEqual(data.experiment.constraints[0].bodyAId, 'test-box-id');
      assert.strictEqual(data.experiment.constraints[0].label, 'Cable');
      testExperimentId = data.experiment._id;
    });

    await t.test('GET /api/experiments - Should fetch saved layouts list', async () => {
      const res = await fetch(`${BASE_URL}/api/experiments`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data), 'Experiments list should be an array');
      const found = data.some(exp => exp._id === testExperimentId);
      assert.ok(found, 'Saved experiment should exist in the retrieved array list');
    });

    await t.test('DELETE /api/experiments/:id - Should delete a saved layout', async () => {
      assert.ok(testExperimentId, 'Valid experiment ID must be present');
      const res = await fetch(`${BASE_URL}/api/experiments/${testExperimentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.message, 'Experiment deleted successfully');
    });
  }

  // 5. AI tutor chat endpoint test
  await t.test('POST /api/ai/chat - Should return contextual advisor text and formulas', async () => {
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'explain Pendulum',
        activePreset: 'pendulum',
        selectedBody: {
          labelName: 'Pendulum Bob',
          mass: 1.0,
          restitution: 0.8,
          friction: 0.05,
          position: { x: 100, y: 100 },
          velocity: { x: 1.2, y: -0.5 }
        },
        isPlaying: true
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.speech, 'AI tutor reply speech should exist');
    assert.ok(data.insight, 'AI formula insight chip should exist');
    assert.ok(data.speech.toLowerCase().includes('pendulum') || data.speech.includes('swing') || data.speech.includes('gravity'), 'Tutor response should discuss pendulum kinematics');
  });
});
