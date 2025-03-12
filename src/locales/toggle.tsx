import React from 'react';
import Link from 'next/link';

const LanguageToggle = () => {
  return (
    <nav className="flex p-2 gap-2">
      <Link href="/en">ENG</Link>
      <div>|</div>
      <Link href="/ko">KOR</Link>
    </nav>
  );
};

export default LanguageToggle;
