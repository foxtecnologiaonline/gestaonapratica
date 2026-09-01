import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { getAllPostSlugs } from "@/lib/posts";
import { validatePostPayload } from "@/lib/post-validation";
import { publishPost } from "@/lib/posts-admin";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const validation = validatePostPayload(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const { slug, title, description, date, tags, relatedProduct, content } = validation.data;

  if (getAllPostSlugs().includes(slug)) {
    return NextResponse.json({ error: "Já existe um post com esse slug." }, { status: 409 });
  }

  const fileContent = matter.stringify(content, {
    title,
    description,
    date,
    tags,
    ...(relatedProduct ? { relatedProduct } : {}),
  });

  const result = await publishPost(`${slug}.mdx`, fileContent, `Adiciona post: ${title}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, viaGithub: result.viaGithub });
}
