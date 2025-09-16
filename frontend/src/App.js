import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import Admin from './layouts/Admin';

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* 폰트 크기 시스템 */
    --font-xs: 0.75rem;    /* 12px */
    --font-sm: 0.875rem;   /* 14px */
    --font-base: 1rem;     /* 16px */
    --font-lg: 1.125rem;   /* 18px */
    --font-xl: 1.25rem;    /* 20px */
    --font-2xl: 1.5rem;    /* 24px */
    --font-3xl: 1.875rem;  /* 30px */
    --font-4xl: 2.25rem;   /* 36px */

    /* 색상 시스템 */
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --text-tertiary: #6b7280;
    --text-light: #9ca3af;
    --accent-primary: #667eea;
    --accent-secondary: #764ba2;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
    background-color: #f8fafc;
    color: var(--text-primary);
    line-height: 1.6;
    font-size: var(--font-base);
    margin: 0;
    overflow-x: hidden;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 제목 스타일 */
  h1 {
    font-size: var(--font-4xl);
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-primary);
    letter-spacing: -0.025em;
  }

  h2 {
    font-size: var(--font-3xl);
    font-weight: 600;
    line-height: 1.3;
    color: var(--text-primary);
    letter-spacing: -0.025em;
  }

  h3 {
    font-size: var(--font-2xl);
    font-weight: 600;
    line-height: 1.4;
    color: var(--text-primary);
  }

  /* 본문 텍스트 */
  p {
    font-size: var(--font-base);
    line-height: 1.6;
    color: var(--text-secondary);
  }

  /* 작은 텍스트 */
  small {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
  }

  /* 링크 */
  a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  a:hover, a:focus {
    color: var(--accent-secondary);
    text-decoration: none;
  }

  /* 버튼 기본 스타일 */
  button {
    font-family: inherit;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  /* 입력 필드 */
  input, select, textarea {
    font-family: inherit;
    font-size: var(--font-base);
  }

  /* 테이블 */
  table {
    font-family: inherit;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
