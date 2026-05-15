import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3010", 10),
  user: process.env.DB_USER || "your-user-name",
  password: process.env.DB_PASSWORD || "your-password",
  database: process.env.DB_NAME || "your-database",
};

// Connection Pool
const pool = mysql.createPool(dbConfig);

export interface SubRecord {
  id: number;
  sub_link: string;
  sub_id: string | null;
  sub_type: string | null; // v2ray or openvpn or wireguard
  config_type: string | null; //url or file
  total_volume_gb: number | null;
  used_volume_gb: number | null;
  usage_percentage: number | null;
  duration_days: number | null;
  status: string | null; //free=Available stock, assigned=Given to a customer, expired=Manually expired or duration passed
  assigned_to: string | null;
  expired_at: Date | null;
  bought_from: string | null;
  notes: string | null;
}

export async function getAllSubs(): Promise<SubRecord[]> {
  const [rows] = await pool.query("SELECT * FROM subs ORDER BY id DESC");
  return rows as SubRecord[];
}

export async function getSubById(id: number): Promise<SubRecord | null> {
  const [rows] = await pool.query("SELECT * FROM subs WHERE id = ?", [id]);
  const links = rows as SubRecord[];
  return links[0] || null;
}

export async function createSub(
  subLink: string,
  username: string,
): Promise<number> {
  const [result] = await pool.query(
    "INSERT INTO subs (sub_link, sub_id) VALUES (?,?)",
    [subLink, username],
  );

  return (result as any).insertId;
}

export async function updateSubData(
  id: number,
  data: {
    username?: string;
    total_volume_gb?: number;
    used_volume_gb?: number;
    duration_days?: number;
  },
): Promise<void> {
  // console.log("Updating sub with ID:", id, "Data:", data);

  await pool.query(
    `UPDATE subs SET sub_id = ?, total_volume_gb = ?, used_volume_gb = ?, duration_days = ? WHERE id = ?`,
    [
      data.username,
      data.total_volume_gb,
      data.used_volume_gb,
      data.duration_days,
      id,
    ],
  );
}

export async function deleteSub(id: number): Promise<void> {
  await pool.query("DELETE FROM subs WHERE id = ?", [id]);
}

export default pool;
