-- Add practical client/contact and platform fields to campaigns.

create type public.campaign_platform as enum (
  'instagram',
  'tiktok',
  'facebook',
  'xhs',
  'other'
);

alter table public.campaigns
add column client_name text,
add column client_phone text,
add column client_email text,
add column platform public.campaign_platform;

alter table public.campaigns
add constraint campaigns_client_name_not_empty
  check (client_name is null or length(trim(client_name)) > 0),
add constraint campaigns_client_phone_not_empty
  check (client_phone is null or length(trim(client_phone)) > 0),
add constraint campaigns_client_email_not_empty
  check (client_email is null or length(trim(client_email)) > 0);
