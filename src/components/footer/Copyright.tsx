import { CLASS_HOVER } from '@/constants/common'

export const RenderCopyright = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
      <div className="flex flex-wrap gap-4">
        <a href="#" className={CLASS_HOVER}>Sitemap</a>
        <a href="#" className={CLASS_HOVER}>Danh mục sản phẩm</a>
        <a href="#" className={CLASS_HOVER}>Hỏi đáp</a>
        <a href="#" className={CLASS_HOVER}>Thông tin liên hệ</a>
        <a href="#" className={CLASS_HOVER}>Cấu hình thường gặp</a>
      </div>
      <div>Thiết kế bởi Bizweb ©</div>
    </div>
  )
}

