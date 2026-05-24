-- Extend invoices for single-item PDF invoices.
-- Existing invoices are backfilled as quantity 1 with rate equal to current amount.

alter table public.invoices
add column client_address text,
add column payment_terms text,
add column item_description text,
add column quantity numeric(12, 2) not null default 1,
add column rate numeric(12, 2) not null default 0,
add column bank_details text;

update public.invoices
set
  quantity = 1,
  rate = amount;

alter table public.invoices
add constraint invoices_client_address_not_empty
  check (client_address is null or length(trim(client_address)) > 0),
add constraint invoices_payment_terms_not_empty
  check (payment_terms is null or length(trim(payment_terms)) > 0),
add constraint invoices_item_description_not_empty
  check (item_description is null or length(trim(item_description)) > 0),
add constraint invoices_quantity_positive
  check (quantity > 0),
add constraint invoices_rate_non_negative
  check (rate >= 0),
add constraint invoices_bank_details_not_empty
  check (bank_details is null or length(trim(bank_details)) > 0);
