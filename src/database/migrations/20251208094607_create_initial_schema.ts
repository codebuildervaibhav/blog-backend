import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Enable UUID extension (Still good to have for manual SQL queries)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  // -------------------------
  // Table: Users
  // -------------------------
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();

    table.string('email').unique().notNullable();
    table.string('display_name').notNullable();
    table.string('avatar_url').nullable();
    table.text('bio').nullable();
    table.enum('role', ['admin', 'user']).defaultTo('user');
    table.timestamps(true, true);
  });

  // -------------------------
  // Table: Local Auth (Passwords)
  // -------------------------
  await knex.schema.createTable('local_auth', (table) => {
    table
      .uuid('user_id')
      .primary()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('password_hash').notNullable();
    table.string('security_stamp').nullable();
  });

  // -------------------------
  // Table: Social Auth
  // -------------------------
  await knex.schema.createTable('social_auth', (table) => {
    table.uuid('id').primary();

    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('provider').notNullable();
    table.string('provider_account_id').notNullable();
    table.jsonb('tokens').nullable();
    table.unique(['provider', 'provider_account_id']);
  });

  // -------------------------
  // Table: Posts
  // -------------------------
  await knex.schema.createTable('posts', (table) => {
    table.uuid('id').primary();

    // Index added for performance (Find all posts by user)
    table
      .uuid('author_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();

    table.string('title').notNullable();
    table.string('slug').unique().notNullable();
    table.text('content').notNullable();

    // Index added for performance (Find only published posts)
    table.boolean('is_published').defaultTo(false).index();

    table.specificType('tags', 'TEXT[]');
    table.jsonb('metadata').defaultTo('{}');

    // Counters
    table.integer('likes_count').defaultTo(0);
    table.integer('comments_count').defaultTo(0);
    table.integer('views_count').defaultTo(0);

    table.timestamps(true, true);

    // GIN Indexes for fast search on Arrays and JSON
    table.index(['tags'], 'idx_posts_tags', 'GIN');
    table.index(['metadata'], 'idx_posts_metadata', 'GIN');
  });

  // -------------------------
  // Table: Trending Posts
  // -------------------------
  await knex.schema.createTable('trending_posts', (table) => {
    table.uuid('id').primary();

    table.uuid('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.float('trend_score').notNullable();
    table.integer('rank').notNullable();
    table.timestamp('calculated_at').defaultTo(knex.fn.now());
  });

  // -------------------------
  // Table: Comments
  // -------------------------
  await knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary();

    table.uuid('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.text('content').notNullable();
    table.uuid('parent_id').nullable().references('id').inTable('comments');
    table.timestamps(true, true);
  });

  // -------------------------
  // Table: Post Likes
  // -------------------------
  await knex.schema.createTable('post_likes', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('post_id').references('id').inTable('posts').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.primary(['user_id', 'post_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('post_likes');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('trending_posts');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('social_auth');
  await knex.schema.dropTableIfExists('local_auth');
  await knex.schema.dropTableIfExists('users');
}
