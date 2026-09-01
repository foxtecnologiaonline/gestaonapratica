import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { getAllPostSlugs } from "@/lib/posts";
import { validatePostPayload } from "@/lib/post-validation";
import { publishPost, unpublishPost } from "@/lib/posts-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const validation = validatePostPayload({ ...(body as object), slug });
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  if (!getAllPostSlugs().includes(slug)) {
    return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
  }

  const { title, description, date, tags, relatedProduct, content } = validation.data;
  const fileContent = matter.stringify(content, {
    title,
    description,
    date,
    tags,
    ...(relatedProduct ? { relatedProduct } : {}),
  });

  const result = await publishPost(`${slug}.mdx`, fileContent, `Atualiza post: ${title}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, viaGithub: result.viaGithub });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!getAllPostSlugs().includes(slug)) {
    return NextResponse.json({ error: "Post não encontrado." }, { status: 404 });
  }

  const result = await unpublishPost(`${slug}.mdx`, `Remove post: ${slug}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, viaGithub: result.viaGithub });
}
