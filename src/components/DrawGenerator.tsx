import { Show, createSignal } from "solid-js";
import '../loading.css'

export default () => {
  let inputRef: HTMLTextAreaElement;
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const [controller, setController] = createSignal<AbortController>(null);
  const [image, setImage] = createSignal<string>(null);
  const [size, setSize] = createSignal("512x512");
  const [lastPrompt, setLastPrompt] = createSignal<string>(null);
  const handleButtonClick = async () => {
    const inputValue = inputRef.value;
    if (!inputValue) return;

    setLoading(true);
    setImage(null);
    setLastPrompt(inputValue);
    try {

      const controller = new AbortController();
      setController(controller);
  
      const storagePassword = localStorage.getItem("pass");
  
      const timestamp = Date.now();
      const response = await fetch("/api/genPic", {
        method: "POST",
        body: JSON.stringify({
          prompt: inputValue,
          time: timestamp,
          pass: storagePassword,
          size: size()
        }),
        signal: controller.signal,
      });
      
      setImage((await response.json()).imageUrl);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const stopFetch = () => {
    if (controller()) {
      controller().abort();
      setLoading(false);
    }
  };

  return (
    <div my-6>
      <Show
        when={!loading()}
        fallback={() => (
          <div class="gen-cb-wrapper">
            <span>图片生成中...</span>
            <div class="gen-cb-stop" onClick={stopFetch}>
              取消
            </div>
          </div>
        )}
      >
        <div class="gen-text-wrapper flex-col md:flex-row">
          <textarea
            ref={inputRef!}
            value={lastPrompt()}
            placeholder="请输入提示词..."
            autocomplete="off"
            autofocus
            onInput={() => {
              inputRef.style.height = "auto";
              inputRef.style.height = `${inputRef.scrollHeight}px`;
            }}
            rows={1}
            class="gen-textarea"
          />
          <select
            name="尺寸"
            id="size"
            onChange={(e) => setSize(e.target.value)}
            class="gen-slate-btn
            hover:cursor-pointer
            text-center
            lg:text-left
            "
            style={{
              appearance: "none",
              "background-image":
                'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTEyIDE1LjRsLTYtNkw3LjQgOGw0LjYgNC42TDE2LjYgOEwxOCA5LjRsLTYgNloiLz48L3N2Zz4=")',
              "background-repeat": "no-repeat",
              "background-position": "right 10px center",
              "background-size": "1.5rem",
            }}
          >
            <option value="256x256">256x256</option>
            <option value="512x512" selected>
              512x512
            </option>
            <option value="1024x1024">1024x1024</option>
          </select>
          <button onClick={handleButtonClick} gen-slate-btn>
            Draw
          </button>
        </div>
      </Show>
      <Show when={loading()}>
        <div class="loader">Drawing</div>
      </Show>
      <Show
        when={image()}
        fallback={() => (
          <Show when={error()}>
            <div class="my-4 px-4 py-3 border border-red/50 bg-red/10">
              <div class="text-red op-70 text-sm">出错了，请重试</div>
            </div>
          </Show>
        )}
      >
        <img src={image()} style={{ width: "100%" }} />
        <p text-coolGray mt-5 w-auto text-center>{lastPrompt()}</p>
      </Show>
    </div>
  );
};
