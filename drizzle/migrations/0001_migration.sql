
create policy "admin manage product media" on storage.objects for all to authenticated
  using (bucket_id in ('product-media','product-files') and public.has_role(auth.uid(),'admin'))
  with check (bucket_id in ('product-media','product-files') and public.has_role(auth.uid(),'admin'));
