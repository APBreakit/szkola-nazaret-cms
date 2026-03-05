import { sql } from "./index";
// Posts helpers
export async function getPosts(filters) {
    let query = "SELECT * FROM posts WHERE 1=1";
    const params = [];
    if (filters?.type) {
        params.push(filters.type);
        query += ` AND type = $${params.length}`;
    }
    if (filters?.status) {
        params.push(filters.status);
        query += ` AND status = $${params.length}`;
    }
    query += " ORDER BY created_at DESC";
    if (filters?.limit) {
        params.push(filters.limit);
        query += ` LIMIT $${params.length}`;
    }
    return (await sql.query(query, params));
}
export async function getPostById(id) {
    const result = await sql.query("SELECT * FROM posts WHERE id = $1", [id]);
    return result[0];
}
export async function createPost(data) {
    const result = await sql.query(`INSERT INTO posts (
      title, content, excerpt, type, status, published, slug, image_url,
      add_to_calendar, calendar_date, calendar_end_date,
      competition_status, competition_start_date, competition_end_date,
      group_category, user_id, created_at, updated_at
     ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11,
      $12, $13, $14,
      $15, $16, NOW(), NOW()
     ) RETURNING *`, [
        data.title,
        data.content,
        data.excerpt,
        data.type,
        data.status,
        data.published,
        data.slug,
        data.image_url,
        data.add_to_calendar,
        data.calendar_date,
        data.calendar_end_date,
        data.competition_status,
        data.competition_start_date,
        data.competition_end_date,
        data.group_category,
        data.user_id,
    ]);
    return result[0];
}
export async function updatePost(id, data) {
    const result = await sql.query(`UPDATE posts SET
      title = COALESCE($2, title),
      content = COALESCE($3, content),
      excerpt = COALESCE($4, excerpt),
      type = COALESCE($5, type),
      status = COALESCE($6, status),
      published = COALESCE($7, published),
      slug = COALESCE($8, slug),
      image_url = COALESCE($9, image_url),
      add_to_calendar = COALESCE($10, add_to_calendar),
      calendar_date = COALESCE($11, calendar_date),
      calendar_end_date = COALESCE($12, calendar_end_date),
      competition_status = COALESCE($13, competition_status),
      competition_start_date = COALESCE($14, competition_start_date),
      competition_end_date = COALESCE($15, competition_end_date),
      group_category = COALESCE($16, group_category),
      user_id = COALESCE($17, user_id),
      updated_at = NOW()
     WHERE id = $1
     RETURNING *`, [
        id,
        data.title,
        data.content,
        data.excerpt,
        data.type,
        data.status,
        data.published,
        data.slug,
        data.image_url,
        data.add_to_calendar,
        data.calendar_date,
        data.calendar_end_date,
        data.competition_status,
        data.competition_start_date,
        data.competition_end_date,
        data.group_category,
        data.user_id,
    ]);
    return result[0];
}
export async function deletePost(id) {
    await sql.query("DELETE FROM posts WHERE id = $1", [id]);
}
// Galleries helpers
export async function getGalleries() {
    return (await sql.query("SELECT * FROM galleries ORDER BY created_at DESC"));
}
export async function getGalleryById(id) {
    const result = await sql.query("SELECT * FROM galleries WHERE id = $1", [id]);
    return result[0];
}
export async function createGallery(data) {
    const result = await sql.query(`INSERT INTO galleries (title, slug, description, cover_image, status, category)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [data.title, data.slug, data.description, data.cover_image, data.status || "draft", data.category]);
    return result[0];
}
export async function updateGallery(id, data) {
    const result = await sql.query(`UPDATE galleries SET
      title = COALESCE($2, title),
      slug = COALESCE($3, slug),
      description = COALESCE($4, description),
      cover_image = COALESCE($5, cover_image),
      status = COALESCE($6, status),
      category = COALESCE($7, category),
      updated_at = NOW()
     WHERE id = $1
     RETURNING *`, [id, data.title, data.slug, data.description, data.cover_image, data.status, data.category]);
    return result[0];
}
export async function deleteGallery(id) {
    await sql.query("DELETE FROM galleries WHERE id = $1", [id]);
}
// Gallery Images helpers
export async function getGalleryImages(galleryId) {
    return (await sql.query("SELECT * FROM gallery_images WHERE gallery_id = $1 ORDER BY sort_order ASC", [
        galleryId,
    ]));
}
export async function createGalleryImage(data) {
    const result = await sql.query(`INSERT INTO gallery_images (gallery_id, image_url, title, description, sort_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [data.gallery_id, data.image_url, data.title, data.description, data.sort_order || 0]);
    return result[0];
}
export async function updateGalleryImage(id, data) {
    const result = await sql.query(`UPDATE gallery_images SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      sort_order = COALESCE($4, sort_order)
     WHERE id = $1
     RETURNING *`, [id, data.title, data.description, data.sort_order]);
    return result[0];
}
export async function deleteGalleryImage(id) {
    await sql.query("DELETE FROM gallery_images WHERE id = $1", [id]);
}
// Media helpers
export async function getMedia(filters) {
    let query = "SELECT * FROM media WHERE 1=1";
    const params = [];
    if (filters?.type) {
        params.push(filters.type);
        query += ` AND type = $${params.length}`;
    }
    query += " ORDER BY created_at DESC";
    if (filters?.limit) {
        params.push(filters.limit);
        query += ` LIMIT $${params.length}`;
    }
    return (await sql.query(query, params));
}
export async function createMedia(data) {
    const result = await sql.query(`INSERT INTO media (url, type, title, alt_text, caption, file_size)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [data.url, data.type, data.title, data.alt_text, data.caption, data.file_size]);
    return result[0];
}
export async function deleteMedia(id) {
    await sql.query("DELETE FROM media WHERE id = $1", [id]);
}
// Groups helpers
export async function getGroups() {
    return (await sql.query("SELECT * FROM groups ORDER BY name ASC"));
}
export async function getGroupBySlug(slug) {
    const result = await sql.query("SELECT * FROM groups WHERE slug = $1", [slug]);
    return result[0];
}
export async function updateGroup(slug, data) {
    const result = await sql.query(`UPDATE groups SET
      name = COALESCE($2, name),
      color = COALESCE($3, color),
      age_range = COALESCE($4, age_range),
      teacher_name = COALESCE($5, teacher_name),
      teacher_bio = COALESCE($6, teacher_bio),
      teacher_image = COALESCE($7, teacher_image),
      password = COALESCE($8, password),
      schedule = COALESCE($9, schedule),
      description = COALESCE($10, description)
     WHERE slug = $1
     RETURNING *`, [
        slug,
        data.name,
        data.color,
        data.age_range,
        data.teacher_name,
        data.teacher_bio,
        data.teacher_image,
        data.password,
        data.schedule ? JSON.stringify(data.schedule) : undefined,
        data.description,
    ]);
    return result[0];
}
