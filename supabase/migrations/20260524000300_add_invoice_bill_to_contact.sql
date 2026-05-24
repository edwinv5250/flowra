-- Add optional Bill To contact fields for invoices.

alter table public.invoices
add column client_email text,
add column client_phone text;

alter table public.invoices
add constraint invoices_client_email_not_empty
  check (client_email is null or length(trim(client_email)) > 0),
add constraint invoices_client_phone_not_empty
  check (client_phone is null or length(trim(client_phone)) > 0);
