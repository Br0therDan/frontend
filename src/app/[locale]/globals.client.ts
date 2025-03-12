/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ReactDOM from 'react-dom';

// 클라이언트에서만 적용: ReactDOM.findDOMNode가 없다면 간단한 폴리필 적용
if (typeof window !== 'undefined' && !ReactDOM.findDOMNode) {
  // 전달받은 노드를 그대로 반환하는 간단한 폴리필
  ReactDOM.findDOMNode = (node: any) => node;
}
