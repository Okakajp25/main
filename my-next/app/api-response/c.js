import React from "react";

export const runtime = 'edge'

function MainComponent({ fetching, responses, errorOccurred, fetchSuccess }) {
  return (
    <div>
      <div
        className={`my-2 font-semibold ${
          errorOccurred
            ? "text-red-600"
            : fetchSuccess
            ? "text-green-600"
            : "hidden"
        }`}
      >
        {errorOccurred ? "Error" : "Success"}
      </div>
      {responses.map((response, index) => (
        <div
          key={index}
          className="w-full text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-md overflow-auto p-3 my-2"
        >
          {JSON.stringify(response, null, 2)}
        </div>
      ))}
    </div>
  );
}

function StoryComponent() {
  const [fetching, setFetching] = React.useState(false);
  const [responses, setResponses] = React.useState([]);
  const [errorOccurred, setErrorOccurred] = React.useState(false);
  const [fetchSuccess, setFetchSuccess] = React.useState(false);
  const [currentRepeat, setCurrentRepeat] = React.useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = event.target.apiUrl.value;
    const repeatCount = parseInt(event.target.repeatCount.value, 10) || 0;

    setFetching(true);
    setErrorOccurred(false);
    setResponses([]);
    setFetchSuccess(false);
    setCurrentRepeat(0);

    for (let i = 0; i < repeatCount; i++) {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResponses((currentResponses) => [...currentResponses, data]);
        setCurrentRepeat(i + 1);
      } catch (error) {
        setErrorOccurred(true);
        setFetching(false);
        return;
      }
    }

    setFetchSuccess(true);
    setFetching(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        REST API を使用してデータを取得するフォーム
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="api-url"
            className="block text-sm font-medium text-gray-700"
          >
            API URL
          </label>
          <input
            type="text"
            name="apiUrl"
            id="api-url"
            disabled={fetching}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="repeat-count"
            className="block text-sm font-medium text-gray-700"
          >
            繰り返し回数
          </label>
          <input
            type="number"
            name="repeatCount"
            id="repeat-count"
            min="1"
            defaultValue="1"
            disabled={fetching}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={fetching}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              fetching ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {fetching ? "Fetching..." : "Fetch Data"}
          </button>
          <span className="text-gray-500">({currentRepeat})</span>
        </div>
        <MainComponent
          fetching={fetching}
          responses={responses}
          errorOccurred={errorOccurred}
          fetchSuccess={fetchSuccess}
        />
      </form>
    </div>
  );
}

export default MainComponent;
