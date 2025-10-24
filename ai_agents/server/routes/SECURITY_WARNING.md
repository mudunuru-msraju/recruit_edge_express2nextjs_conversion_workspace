# ⚠️ CRITICAL SECURITY WARNING ⚠️

## DEVELOPMENT-ONLY IMPLEMENTATION

**This Resume Builder API is NOT production-ready!**

### 🚨 Current Security Vulnerability

**Problem:** The API currently accepts `userId` from request parameters (query strings and request bodies), which means:

- ✅ **Any user can impersonate any other user** by changing the userId parameter
- ✅ **Cross-user data access** is possible
- ✅ **Privilege escalation** is trivial
- ✅ **No authentication** is enforced

**Example Attack:**
```bash
# User A (userId=1) can read User B's resume (userId=2) by simply changing the parameter:
curl "http://localhost:3000/api/agents/resume-builder/resumes/5?userId=2"

# User A can update User B's resume:
curl -X PUT http://localhost:3000/api/agents/resume-builder/resumes/5 \
  -d '{"userId": 2, "title": "Hacked Resume"}'
```

---

## ✅ REQUIRED FIXES BEFORE PRODUCTION

### 1. Implement Authentication Middleware

```typescript
// server/middleware/auth.ts
export const requireAuth = async (req, res, next) => {
  // Get userId from authenticated session (NOT from request parameters)
  const userId = req.session?.user?.id; // From Auth.js
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Attach authenticated userId to request
  req.userId = userId;
  next();
};
```

### 2. Update Routes to Use Authenticated Context

```typescript
// server/routes/resumeBuilder.ts

// ❌ CURRENT (INSECURE):
router.get('/resumes/:id', async (req, res) => {
  const userId = req.query.userId; // Trusts caller!
  // ...
});

// ✅ REQUIRED (SECURE):
router.get('/resumes/:id', requireAuth, async (req, res) => {
  const userId = req.userId; // From authenticated session
  // ...
});
```

### 3. Remove userId from Client Requests

```typescript
// ❌ CURRENT (INSECURE):
export const getResume = async (id: number) => {
  const userId = getMockUserId(); // Mock user!
  fetch(`/api/resumes/${id}?userId=${userId}`);
};

// ✅ REQUIRED (SECURE):
export const getResume = async (id: number) => {
  // No userId needed - server gets it from session
  fetch(`/api/resumes/${id}`);
};
```

---

## 📋 Production Deployment Checklist

Before deploying to production, you MUST:

- [ ] Install and configure Auth.js with Google OAuth
- [ ] Create authentication middleware that validates session
- [ ] Update ALL resume routes to use `requireAuth` middleware
- [ ] Derive `userId` from `req.userId` (authenticated context)
- [ ] Remove ALL `userId` parameters from API client functions
- [ ] Remove `getMockUserId()` from client code
- [ ] Add integration tests for cross-user access attempts
- [ ] Verify tests confirm unauthorized access is blocked
- [ ] Audit all other agent routes for same vulnerability
- [ ] Security review by qualified personnel

---

## 🔒 Recommended Security Architecture

```typescript
// 1. Auth Middleware
app.use('/api/agents', requireAuth);

// 2. Routes ONLY use req.userId
router.get('/resume-builder/resumes/:id', async (req, res) => {
  const userId = req.userId; // From auth middleware
  const resumeId = parseInt(req.params.id);
  
  // Safe query - user can only access their own data
  const resume = await db
    .select()
    .from(resumes)
    .where(and(
      eq(resumes.id, resumeId),
      eq(resumes.userId, userId) // From authenticated session
    ));
});

// 3. Client doesn't send userId
const resume = await getResume(resumeId);
```

---

## 🛡️ Why This Matters

**Without proper authentication:**
- User data can be stolen
- Resumes can be modified/deleted by attackers
- Privacy violations occur
- Platform liability increases
- Trust is destroyed

**With proper authentication:**
- Users can only access their own data
- Attacks are prevented
- Privacy is protected
- Platform is trustworthy

---

## 📝 Current Status

**Status:** ⚠️ DEVELOPMENT ONLY  
**Blocking Issue:** No authentication implemented  
**Risk Level:** 🔴 CRITICAL  
**Action Required:** Implement Auth.js before ANY production use  

---

**DO NOT deploy this code to production without implementing proper authentication!**

*Last Updated: October 23, 2025*
