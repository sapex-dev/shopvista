import { useQuery } from "@tanstack/react-query";
import { getFAQs } from "../services/FAQ/faqAPI";
import Spinner from "../utils/Spinner";
import { HtmlDataProcessor } from "@ckeditor/ckeditor5-engine";

const FAQsUI = () => {
  const { isSuccess, isFetching, error, data } = useQuery({
    queryKey: ["allFAQ"],
    queryFn: getFAQs,
    refetchOnWindowFocus: false,
    // select: (data) => data?.reverse(),
  });

  if (isSuccess) {
    console.log("🚀 ~ FAQsUI ~ data:", data);
  }

  return (
    <div>
      {isFetching ? (
        <div className="flex items-center justify-center vh-100 mt-60">
          <Spinner />
        </div>
      ) : (
        <div className="flex items-center justify-center mb-14">
          <section className="dark:bg-gray-800 dark:text-gray-100">
            <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8">
              <h2 className="text-2xl font-semibold sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 mb-8 dark:text-gray-400">
                These are some Frequently asked Questions.You may get your
                answers here...
              </p>
              <div className="space-y-4">
                {data?.map((faq, index) => (
                  <details
                    className="w-full border rounded-lg cursor-pointer"
                    key={index}
                  >
                    <summary className="px-4 py-6 focus:outline-none focus-visible:ri font-semibold">
                      {faq.question}
                    </summary>
                    <div className="px-4 py-6 pt-0 ml-4 -mt-4 dark:text-gray-400" dangerouslySetInnerHTML={{
                        __html: faq.answer,
                      }}>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default FAQsUI;
