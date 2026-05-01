begin;

-- Compare labels without relying on the unaccent extension.
-- certification bio / certificacion bio -> Certification + tag Bio

update public.categories
set activity_category_label = 'Certification',
    updated_at = now()
where lower(translate(activity_category_label, 'ÁÀÂÄÃáàâäãÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÖÕóòôöõÚÙÛÜúùûüÇç', 'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'))
  in ('certification bio', 'certificacion bio');

update public.projects
set default_activity_category_label = 'Certification',
    updated_at = now()
where lower(translate(default_activity_category_label, 'ÁÀÂÄÃáàâäãÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÖÕóòôöõÚÙÛÜúùûüÇç', 'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'))
  in ('certification bio', 'certificacion bio');

update public.time_entries
set activity_category_label = 'Certification',
    tags_text = case
      when coalesce(tags_text, '') = '' then 'Bio'
      when position('bio' in lower(tags_text)) > 0 then tags_text
      else concat(tags_text, ', Bio')
    end,
    updated_at = now()
where lower(translate(activity_category_label, 'ÁÀÂÄÃáàâäãÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÖÕóòôöõÚÙÛÜúùûüÇç', 'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'))
  in ('certification bio', 'certificacion bio');

update public.active_sessions
set activity_category_label = 'Certification',
    tags_text = case
      when coalesce(tags_text, '') = '' then 'Bio'
      when position('bio' in lower(tags_text)) > 0 then tags_text
      else concat(tags_text, ', Bio')
    end,
    updated_at = now()
where lower(translate(activity_category_label, 'ÁÀÂÄÃáàâäãÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÖÕóòôöõÚÙÛÜúùûüÇç', 'AAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCc'))
  in ('certification bio', 'certificacion bio');

commit;
