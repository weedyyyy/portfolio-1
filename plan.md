# Backend Integration Plan

This document outlines the plan for integrating a Supabase backend into the portfolio website.

### **Phase 1: Contact Form**

1. **Supabase Setup**:

      - Create a new Supabase project.
      - Define a `messages` table with columns for `name`, `email`, `message`, and a timestamp.
      - Enable Row Level Security (RLS) to allow public `INSERT` operations while restricting reads.

2. **Backend Integration**:

      - Install the `@supabase/supabase-js` library.
      - Create a `src/lib/supabase.ts` file to initialize and export the Supabase client.
      - Store Supabase URL and anon key in environment variables (`.env.local`).

3. **API Route**:

      - Create a new API route at `src/app/api/contact/route.ts`.
      - This route will handle `POST` requests, validate the incoming data, and insert the message into the Supabase `messages` table.

4. **Frontend Form**:
      - Create a new `ContactForm` component with fields for name, email, and message.
      - Add state management to handle user input and submission status (loading, success, error).
      - Replace the current static contact section on the main page with the new form.

### **Phase 2: Project Views & Likes**

1. **Supabase Setup**:

      - Create a `project_stats` table with columns for `project_slug`, `views`, and `likes`.
      - Each project `slug` will have a unique corresponding row in this table.

2. **API for Views**:

      - Create a new API route that increments the `views` count for a given project slug.
      - This API will be called on the client-side when a project detail page is loaded.

3. **API for Likes**:

      - Create an API route to increment the `likes` count.
      - This will be triggered by a "like" button on the project detail page.

4. **Frontend UI**:
      - Display the view and like counts on both the project cards on the main page and on the project detail pages.
      - Add a "like" button with a visual indicator to show if a user has already liked a project (using local storage).

### **Phase 3: Blog from CMS**

1. **Supabase Setup**:

      - Create a `posts` table with columns for `slug`, `title`, `content` (in Markdown), and `published_at`.
      - Use the Supabase table editor as a simple CMS to write and manage blog posts.

2. **API for Blog**:

      - Create an API route to fetch all published blog posts for the main blog page.
      - Create another API route to fetch a single post by its `slug` for the blog detail page.

3. **Frontend Integration**:
      - Replace the current file-based blog (`/content/*.mdx`) with a dynamic blog that fetches data from Supabase.
      - Update the blog list and detail pages to render the content fetched from the API.
