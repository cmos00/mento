-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment(
  row_id UUID,
  table_name TEXT,
  column_name TEXT
) RETURNS INTEGER AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1 RETURNING %I', table_name, column_name, column_name, column_name)
  USING row_id;
  RETURN 1;
END;
$$ LANGUAGE plpgsql;

-- 사용자 프로필 업데이트 함수
CREATE OR REPLACE FUNCTION update_user_profile(
  user_id UUID,
  updates JSONB
) RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET 
    name = COALESCE(updates->>'name', name),
    company = COALESCE(updates->>'company', company),
    position = COALESCE(updates->>'position', position),
    experience = COALESCE(updates->>'experience', experience),
    bio = COALESCE(updates->>'bio', bio),
    skills = COALESCE(updates->>'skills', skills),
    linkedin_url = COALESCE(updates->>'linkedin_url', linkedin_url),
    website = COALESCE(updates->>'website', website),
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;
