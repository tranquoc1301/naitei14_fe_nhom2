import { Container } from '@/components/ui/Container'
import { RenderNewsletter } from './Newsletter'
import { RenderNavigation } from './Navigation'
import { RenderCopyright } from './Copyright'
import { RenderSocialLinks } from './SocialLinks'

export const RenderFooter = () => {
  return (
    <footer className="bg-gray-dark text-white">
      <div className="border-b border-gray-600 py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm">KÊNH THÔNG TIN TỪ CHÚNG TÔI</span>
              <RenderSocialLinks />
            </div>
            <RenderNewsletter />
          </div>
        </Container>
      </div>

      <div className="py-8">
        <Container>
          <RenderNavigation />
        </Container>
      </div>

      <div className="border-t border-gray-600 py-4">
        <Container>
          <RenderCopyright />
        </Container>
      </div>
    </footer>
  )
}

