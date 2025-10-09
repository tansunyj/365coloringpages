'use client';

import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">管理员仪表板</h1>
            <p className="mt-2 text-gray-600">365 Coloring Pages 网站数据概览</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}