export const generateToken = (userId, email, name) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
        userId,
        email,
        name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
    }));
    const signature = btoa("fake-signature");
    return `${header}.${payload}.${signature}`;
};

export const verifyToken = (token) => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        return null;
    }
};
