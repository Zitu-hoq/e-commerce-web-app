import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border shadow-md dark:bg-gray-950 dark:border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4 md:px-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
              ZAP
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-3">
              Your trusted online marketplace
              <br /> For quality products.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.92 4.92 0 0 1 1.78 1.153 4.92 4.92 0 0 1 1.153 1.78c.163.457.347 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.78 4.92 4.92 0 0 1-1.78 1.153c-.457.163-1.257.347-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.78-1.153 4.92 4.92 0 0 1-1.153-1.78c-.163-.457-.347-1.257-.403-2.427C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.78 4.92 4.92 0 0 1 1.78-1.153c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0 1.684c-3.17 0-3.548.012-4.795.07-.999.046-1.54.213-1.897.355-.477.185-.82.406-1.178.764-.358.358-.579.701-.764 1.178-.142.357-.309.898-.355 1.897-.058 1.247-.07 1.625-.07 4.795s.012 3.548.07 4.795c.046.999.213 1.54.355 1.897.185.477.406.82.764 1.178.358.358.701.579 1.178.764.357.142.898.309 1.897.355 1.247.058 1.625.07 4.795.07s3.548-.012 4.795-.07c.999-.046 1.54-.213 1.897-.355.477-.185.82-.406 1.178-.764.358-.358.579-.701.764-1.178.142-.357.309-.898.355-1.897.058-1.247.07-1.625.07-4.795s-.012-3.548-.07-4.795c-.046-.999-.213-1.54-.355-1.897a3.237 3.237 0 0 0-.764-1.178 3.237 3.237 0 0 0-1.178-.764c-.357-.142-.898-.309-1.897-.355-1.247-.058-1.625-.07-4.795-.07zm0 3.919a5.238 5.238 0 1 1 0 10.476 5.238 5.238 0 0 1 0-10.476zm0 1.684a3.554 3.554 0 1 0 0 7.108 3.554 3.554 0 0 0 0-7.108zm5.406-3.919a1.224 1.224 0 1 1 0 2.448 1.224 1.224 0 0 1 0-2.448z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                aria-label="Telegram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.993 15.074 9.85 19.17c.322 0 .462-.138.63-.303l1.51-1.45 3.127 2.295c.573.316.98.15 1.13-.53l2.048-9.624c.21-.94-.34-1.31-.9-1.08l-12.02 4.63c-.82.316-.807.77-.14.98l3.07.96 7.12-4.49c.335-.203.64-.09.39.13l-5.82 5.39z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
              Company
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
              Support
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors"
                >
                  Track Order
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-3 bg-border dark:bg-border" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
            © 2024 ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
