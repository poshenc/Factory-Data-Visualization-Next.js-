import '@/app/ui/globals.scss'
import type { Metadata } from 'next'
import { DialogProvider } from './ui/context/DialogContext'
import { SideBarProvider } from './ui/context/SideBarContext'
import { AlarmProvider } from './ui/context/TempAlarmContext'
import { WafersProvider } from './ui/context/WafersContext'
import Content from './ui/layouts/Content/Content'
import Header from './ui/layouts/Header/Header'
import SideBar from './ui/layouts/SideBar/SideBar'
import TanstackQueryProvider from './ui/providers/TanstackQueryProvider'

export const metadata: Metadata = {
  title: 'Factory Data Visualization'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SideBarProvider>
          <AlarmProvider>
            <DialogProvider>
              <WafersProvider>
                <TanstackQueryProvider>
                  <Header />
                  <SideBar />
                  <Content>
                    {children}
                  </Content>
                </TanstackQueryProvider>
              </WafersProvider>
            </DialogProvider>
          </AlarmProvider>
        </SideBarProvider>
      </body>
    </html>
  )
}
