"use client";

import React from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

const Product = () => {
  const params = useSearchParams();
  console.log('category params:', params.get('category'));
  console.log('brand params:', params.get('brand'));

  return (
    <div>Product</div>
  )
}

export default Product