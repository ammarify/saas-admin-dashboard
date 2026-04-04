function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function seededInt(seed, min, max) {
  const normalized = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
  return Math.floor(normalized * (max - min + 1)) + min;
}

function formatDate(dateInput) {
  const date = new Date(dateInput || Date.now());
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function buildCartTotal(cart, productsById) {
  return (cart.products || []).reduce((sum, item) => {
    const productId = item.productId ?? item.id;
    const product = productsById.get(productId);
    const price = Number(product?.price || 0);
    const lineTotal = Number(item.total || 0);
    if (lineTotal > 0) {
      return sum + lineTotal;
    }
    return sum + price * Number(item.quantity || 1);
  }, 0);
}

function userFullName(user) {
  const first = user?.name?.firstname || user?.firstName || '';
  const last = user?.name?.lastname || user?.lastName || '';
  return `${first} ${last}`.trim() || 'Guest';
}

export function mapProducts(products = []) {
  return products.map((product) => ({
    name: product.title,
    sku: `PRD-${1000 + product.id}`,
    stock: seededInt(product.id, 8, 120),
    price: formatCurrency(product.price),
    category: product.category,
    id: product.id,
  }));
}

export function mapOrders(carts = [], users = [], products = []) {
  const userById = new Map(users.map((user) => [user.id, user]));
  const productsById = new Map(products.map((product) => [product.id, product]));
  const statuses = ['status_delivered', 'status_processing', 'status_pending', 'status_cancelled'];

  return carts.map((cart, index) => {
    const customer = userFullName(userById.get(cart.userId));
    const firstProductId = cart.products?.[0]?.productId ?? cart.products?.[0]?.id;
    const itemTitle = productsById.get(firstProductId)?.title || 'Mixed Cart Items';
    const total = buildCartTotal(cart, productsById);
    return {
      id: `ORD-${10200 + cart.id}`,
      customer,
      item: itemTitle,
      total: formatCurrency(total),
      status: statuses[index % statuses.length],
      date: formatDate(cart.date),
      rawId: cart.id,
    };
  });
}

export function mapCustomers(users = [], carts = [], products = []) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const totalsByUser = new Map();
  const countsByUser = new Map();

  carts.forEach((cart) => {
    const cartTotal = buildCartTotal(cart, productsById);
    totalsByUser.set(cart.userId, (totalsByUser.get(cart.userId) || 0) + cartTotal);
    countsByUser.set(cart.userId, (countsByUser.get(cart.userId) || 0) + 1);
  });

  return users.map((user) => ({
    name: userFullName(user),
    email: user.email,
    orders: countsByUser.get(user.id) || seededInt(user.id, 1, 8),
    spent: formatCurrency(totalsByUser.get(user.id) || seededInt(user.id, 120, 1800)),
    id: user.id,
  }));
}

export function mapReviews(products = [], users = []) {
  const fallbackMessages = [
    'Excellent overall buying experience and fast delivery.',
    'Product quality is solid and support was helpful.',
    'Checkout was easy and packaging was clean.',
  ];

  return products.map((product, index) => {
    const customer = userFullName(users[index % Math.max(users.length, 1)] || {});
    const rating = Math.min(5, Math.max(1, Math.round(product.rating?.rate || 4)));
    return {
      customer,
      rating,
      message: (product.description || fallbackMessages[index % fallbackMessages.length]).slice(0, 110),
      id: product.id,
    };
  });
}

export function mapPayments(carts = [], products = []) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const methods = ['Stripe', 'Card', 'PayPal'];
  return carts.map((cart, index) => {
    const total = buildCartTotal(cart, productsById);
    let status = 'status_paid';
    if (index % 5 === 1) status = 'status_pending';
    if (index % 5 === 4) status = 'status_refunded';
    return {
      id: `PAY-${5500 + cart.id}`,
      method: methods[index % methods.length],
      amount: formatCurrency(total),
      status,
      date: formatDate(cart.date),
      rawId: cart.id,
    };
  });
}

export function mapAccounts(users = []) {
  const roles = ['Admin', 'Operations', 'Support', 'Marketing', 'Finance', 'Sales', 'Designer'];
  return users.map((user, index) => ({
    name: userFullName(user),
    role: roles[index % roles.length],
    email: user.email,
    status: index % 3 === 0 ? 'status_invited' : 'status_active',
    id: user.id,
  }));
}

export function mapSupportTickets(users = [], products = [], carts = []) {
  const priorities = ['high', 'medium', 'low'];
  const statuses = ['open', 'in_progress'];
  return carts.slice(0, 12).map((cart, index) => {
    const assignee = userFullName(users[index % Math.max(users.length, 1)] || {});
    const product = products[index % Math.max(products.length, 1)];
    return {
      id: `SUP-${8800 + cart.id}`,
      subject: `Issue with ${product?.category || 'order processing'}`,
      priority: priorities[index % priorities.length],
      assignee,
      status: statuses[index % statuses.length],
    };
  });
}

export function buildAnalytics(products = [], carts = [], users = []) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const revenue = carts.reduce((sum, cart) => sum + buildCartTotal(cart, productsById), 0);
  const orderCount = carts.length;
  const avgOrder = orderCount ? revenue / orderCount : 0;
  const conversion = users.length ? Math.min(12, (orderCount / users.length) * 10) : 0;
  const bounce = Math.max(18, 42 - Math.round(conversion));

  return {
    revenue: formatCurrency(revenue),
    conversion: `${conversion.toFixed(1)}%`,
    avgOrder: formatCurrency(avgOrder),
    bounce: `${bounce}%`,
  };
}

export function buildDashboardSummary(products = [], carts = []) {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const totalSales = carts.reduce((sum, cart) => sum + buildCartTotal(cart, productsById), 0);
  const orderCount = carts.length;
  const topProducts = [...products]
    .sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
    .slice(0, 4)
    .map((item) => [item.title, formatCurrency(item.price)]);

  return {
    totalSales: formatCurrency(totalSales),
    orderCount,
    topProducts,
  };
}
