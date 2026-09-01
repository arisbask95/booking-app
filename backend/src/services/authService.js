// ---- Service layer ----
// Business logic for registration/login. Controllers never touch
// bcrypt/jwt or the repository directly — they only call this.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

const authService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw Object.assign(new Error("name, email and password are required"), { status: 400 });
    }
    if (password.length < 6) {
      throw Object.assign(new Error("password must be at least 6 characters"), { status: 400 });
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw Object.assign(new Error("email already registered"), { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, password: hashed, role: "CUSTOMER" });

    return { user: toPublicUser(user), token: signToken(user) };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error("invalid credentials"), { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error("invalid credentials"), { status: 401 });
    }
    return { user: toPublicUser(user), token: signToken(user) };
  },

  async me(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw Object.assign(new Error("user not found"), { status: 404 });
    return toPublicUser(user);
  },
};

module.exports = authService;
