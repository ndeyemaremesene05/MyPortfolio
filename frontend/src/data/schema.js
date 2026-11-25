// Modèle de données d'Eventia, simplifié pour la lecture.
// Adaptez les noms de colonnes à ceux de votre base réelle si besoin.

export const TABLE_W = 190
export const HEAD_H = 30
export const ROW_H = 22
export const VIEWBOX = { w: 860, h: 560 }

export const TABLES = [
  {
    name: 'users', x: 305, y: 20,
    note: 'Tous les comptes : clients, prestataires et administrateurs.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'name', type: 'varchar' },
      { name: 'email', type: 'varchar', unique: true },
      { name: 'role', type: 'enum' },
      { name: 'country', type: 'char(2)' },
    ],
  },
  {
    name: 'vendors', x: 590, y: 20,
    note: 'Profil professionnel d’un prestataire, validé par l’administration.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'user_id', key: 'fk', type: 'bigint' },
      { name: 'category_id', key: 'fk', type: 'bigint' },
      { name: 'business_name', type: 'varchar' },
      { name: 'city', type: 'varchar' },
      { name: 'is_verified', type: 'boolean' },
    ],
  },
  {
    name: 'events', x: 20, y: 140,
    note: 'Un événement organisé par un client.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'client_id', key: 'fk', type: 'bigint' },
      { name: 'type', type: 'enum' },
      { name: 'event_date', type: 'date' },
      { name: 'budget', type: 'decimal' },
      { name: 'guests', type: 'int' },
      { name: 'city', type: 'varchar' },
    ],
  },
  {
    name: 'bookings', x: 305, y: 230,
    note: 'Table d’association entre un événement et un prestataire.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'event_id', key: 'fk', type: 'bigint' },
      { name: 'vendor_id', key: 'fk', type: 'bigint' },
      { name: 'status', type: 'enum' },
      { name: 'price', type: 'decimal' },
    ],
  },
  {
    name: 'quotes', x: 305, y: 400,
    note: 'Demande de devis d’un client à un prestataire, pour un événement.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'event_id', key: 'fk', type: 'bigint' },
      { name: 'vendor_id', key: 'fk', type: 'bigint' },
      { name: 'status', type: 'enum' },
      { name: 'total', type: 'decimal' },
    ],
  },
  {
    name: 'services', x: 590, y: 230,
    note: 'Les prestations proposées par un prestataire, avec prix et unité.',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'vendor_id', key: 'fk', type: 'bigint' },
      { name: 'name', type: 'varchar' },
      { name: 'price', type: 'decimal' },
      { name: 'unit', type: 'varchar' },
    ],
  },
  {
    name: 'categories', x: 590, y: 400,
    note: 'Catégories et sous-catégories (parent_id pointe vers la catégorie mère).',
    cols: [
      { name: 'id', key: 'pk', type: 'bigint' },
      { name: 'parent_id', key: 'fk', type: 'bigint' },
      { name: 'name', type: 'varchar' },
    ],
  },
]

// from = colonne clé étrangère, to = clé primaire référencée
export const EDGES = [
  { id: 'vendor-user', from: ['vendors', 'user_id', 'left'], to: ['users', 'id', 'right'] },
  { id: 'event-client', from: ['events', 'client_id', 'right'], to: ['users', 'id', 'left'] },
  { id: 'booking-event', from: ['bookings', 'event_id', 'left'], to: ['events', 'id', 'right'] },
  { id: 'quote-event', from: ['quotes', 'event_id', 'left'], to: ['events', 'id', 'right'] },
  { id: 'booking-vendor', from: ['bookings', 'vendor_id', 'right'], to: ['vendors', 'id', 'left'] },
  { id: 'quote-vendor', from: ['quotes', 'vendor_id', 'right'], to: ['vendors', 'id', 'left'] },
  { id: 'service-vendor', from: ['services', 'vendor_id', 'right'], to: ['vendors', 'id', 'right'], loop: 38 },
  { id: 'vendor-category', from: ['vendors', 'category_id', 'right'], to: ['categories', 'id', 'right'], loop: 62 },
]

export const QUERIES = [
  {
    id: 'reservations-client',
    title: 'Les réservations d’un client',
    explain: 'Deux jointures : la réservation retrouve son événement et son prestataire. Le filtre porte sur le client propriétaire de l’événement.',
    tables: ['bookings', 'events', 'vendors'],
    edges: ['booking-event', 'booking-vendor'],
    sql: `SELECT e.type, e.event_date,
       v.business_name, b.status, b.price
FROM bookings b
JOIN events  e ON e.id = b.event_id
JOIN vendors v ON v.id = b.vendor_id
WHERE e.client_id = :client_id
ORDER BY e.event_date;`,
  },
  {
    id: 'prestataires-categorie',
    title: 'Prestataires validés par catégorie',
    explain: 'LEFT JOIN pour garder les catégories sans prestataire, condition de validation dans la jointure, puis agrégation.',
    tables: ['categories', 'vendors'],
    edges: ['vendor-category'],
    sql: `SELECT c.name AS categorie, COUNT(v.id) AS prestataires
FROM categories c
LEFT JOIN vendors v
       ON v.category_id = c.id
      AND v.is_verified = 1
GROUP BY c.id, c.name
ORDER BY prestataires DESC;`,
  },
  {
    id: 'devis-attente',
    title: 'Devis en attente d’un prestataire',
    explain: 'On remonte du devis à l’événement, puis de l’événement au client qui l’organise.',
    tables: ['quotes', 'events', 'users'],
    edges: ['quote-event', 'event-client'],
    sql: `SELECT q.id, u.name AS client,
       e.type, e.event_date, q.total
FROM quotes q
JOIN events e ON e.id = q.event_id
JOIN users  u ON u.id = e.client_id
WHERE q.vendor_id = :vendor_id
  AND q.status = 'pending';`,
  },
  {
    id: 'catalogue-ville',
    title: 'Catalogue d’une ville',
    explain: 'Trois tables pour afficher les prestations des traiteurs validés d’une ville, triées par prix.',
    tables: ['services', 'vendors', 'categories'],
    edges: ['service-vendor', 'vendor-category'],
    sql: `SELECT v.business_name, s.name, s.price, s.unit
FROM services s
JOIN vendors    v ON v.id = s.vendor_id
JOIN categories c ON c.id = v.category_id
WHERE v.city = :city
  AND c.name = 'Traiteur'
  AND v.is_verified = 1
ORDER BY s.price;`,
  },
]

export const MIGRATION_EXAMPLE = `Schema::create('bookings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('event_id')->constrained()->cascadeOnDelete();
    $table->foreignId('vendor_id')->constrained()->restrictOnDelete();
    $table->enum('status', ['pending', 'confirmed', 'rejected', 'cancelled'])
          ->default('pending');
    $table->decimal('price', 12, 2)->nullable();
    $table->timestamps();

    $table->unique(['event_id', 'vendor_id']);
});`
