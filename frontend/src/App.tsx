export const App = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto space-y-12">
        {/* Typography Showcase */}
        <section>
          <div className="h3 mb-6">Typography Test</div>
          <div className="space-y-4">
            <div className="h1">h1 - Young Serif 60/65 (-3% spacing)</div>
            <div className="h3">h3 - Young Serif 25/40 (-1% spacing)</div>
            <div className="h4">h4 - Chivo 20/30 (-1% spacing)</div>
            <div className="h5">h5 - Young Serif 14/135% (-1% spacing)</div>
            <div className="p1">p1 - Chivo 17/28 (-2% spacing)</div>
            <div className="p2">p2 - Chivo 15/20 (-2% spacing)</div>
            <div className="p3">p3 - Chivo 13/18 (-2% spacing)</div>
            <div className="p3-caps">p3-caps - Chivo 13/15 (+6% spacing)</div>
          </div>
        </section>

        {/* Color Showcase */}
        <section>
          <div className="h3 mb-6">Color Test</div>

          {/* Primary Colors */}
          <div className="mb-8">
            <div className="h4 mb-4">Primary Colors</div>
            <div className="flex gap-4">
              <div>
                <div className="w-24 h-24 bg-primary-1 border border-secondary-3"></div>
                <div className="p3 mt-2">Primary 1</div>
                <div className="p3-caps">#FFFF70</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-primary-2 border border-secondary-3"></div>
                <div className="p3 mt-2">Primary 2</div>
                <div className="p3-caps">#EFEF99</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-primary-3 border border-secondary-3"></div>
                <div className="p3 mt-2">Primary 3</div>
                <div className="p3-caps">#FFC567</div>
              </div>
            </div>
          </div>

          {/* Secondary Colors */}
          <div>
            <div className="h4 mb-4">Secondary Colors</div>
            <div className="flex gap-4 flex-wrap">
              <div>
                <div className="w-24 h-24 bg-secondary-0 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 0</div>
                <div className="p3-caps">#FFFFFF</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-secondary-1 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 1</div>
                <div className="p3-caps">#9C9CA5</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-secondary-2 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 2</div>
                <div className="p3-caps">#71717B</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-secondary-3 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 3</div>
                <div className="p3-caps">#56565B</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-secondary-4 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 4</div>
                <div className="p3-caps">#404043</div>
              </div>
              <div>
                <div className="w-24 h-24 bg-secondary-5 border border-secondary-3"></div>
                <div className="p3 mt-2">Secondary 5</div>
                <div className="p3-caps">#1D1D21</div>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="mt-8">
            <div className="h4 mb-4">Background Color</div>
            <div>
              <div className="w-24 h-24 bg-background border border-secondary-3"></div>
              <div className="p3 mt-2">Background</div>
              <div className="p3-caps">#F4F5F6</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
