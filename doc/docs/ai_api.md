# 硅基流动的DeepSeekV3 API相关信息如下

## API KEY
sk-vpyvlxubnmqiyfogxduvenjhbqwqcmgskqyypcxrnyumvfhs

## 参考调用指南
curl --request POST \
  --url https://api.siliconflow.cn/v1/chat/completions \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "model": "deepseek-ai/DeepSeek-V3",
  "messages": [
    {
      "role": "user",
      "content": "What opportunities and challenges will the Chinese large model industry face in 2025?"
    }
  ],
  "stream": false,
  "max_tokens": 512,
  "enable_thinking": false,
  "thinking_budget": 4096,
  "min_p": 0.05,
  "stop": null,
  "temperature": 0.7,
  "top_p": 0.7,
  "top_k": 50,
  "frequency_penalty": 0.5,
  "n": 1,
  "response_format": {
    "type": "text"
  },
  "tools": [
    {
      "type": "function",
      "function": {
        "description": "<string>",
        "name": "<string>",
        "parameters": {},
        "strict": false
      }
    }
  ]
}'

### 其他参考
https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions





# 图片 AI
https://www.bigmodel.cn/dev/activities/free/glm-4v-flash

接口文档：https://www.bigmodel.cn/dev/api/normal-model/glm-4v
api key：45befbaea35344c9a6d838b4a68d8598.RnjCVRqzu88O5oLd
	
GLM-4V-Flash 并发数限制：10
接口请求
类型	说明
传输方式	https
请求地址	https://open.bigmodel.cn/api/paas/v4/chat/completions
调用方式	同步调用，等待模型执行完成并返回最终结果或 SSE 调用
字符编码	UTF-8
接口请求格式	JSON
响应格式	JSON 或标准 Stream Event
接口请求类型	POST
开发语言	任意可发起 http 请求的开发语言
请求参数
参数名称	类型	必填	参数说明
model	String	是	调用的模型编码。 模型编码：glm-4v-plus-0111 、glm-4v、glm-4v-flash(免费)
GLM-4V-Plus-0111:具备卓越的多模态理解能力，可同时处理最多5张图像，并支持视频内容理解（视频大小 ＜200M ），适用于复杂的多媒体分析场景。
GLM-4V-Flash（免费）: 专注于高效的单一图像理解，适用于图像解析的场景，例如实时图像分析或批量图像处理。
messages	List<Object>	是	调用语言模型时，将当前对话信息列表作为提示输入给模型， 按照 json 数组形式进行传参。比如，
视频理解参数：{ "role": "user", "content": [ { "type": "video_url", "video_url": { "url" : "https://xxx/xx.mp4" } }, { "type": "text", "text": "请仔细描述这个视频" } ] }
图片理解参数：{ "role": "user", "content": [ { "type": "image_url", "image_url": { "url" : "https://xxx/xx.jpg" } }, { "type": "text", "text": "解释一下图中的现象" } ] }
可能的消息类型包括 User message、Assistant message。见下方 message 消息字段说明。
request_id	String	否	由用户端传参，需保证唯一性；用于区分每次请求的唯一标识，用户端不传时平台会默认生成。
do_sample	Boolean	否	do_sample 为 true 时启用采样策略，do_sample 为 false 时采样策略 temperature、top_p 将不生效
stream	Boolean	否	使用同步调用时，此参数应当设置为 Fasle 或者省略。表示模型生成完所有内容后一次性返回所有内容。如果设置为 True，模型将通过标准 Event Stream ，逐块返回模型生成内容。Event Stream 结束时会返回一条data: [DONE]消息。
temperature	Float	否	采样温度，控制输出的随机性，必须为正数 取值范围是：[0.0,1.0]， 默认值为 0.8，值越大，会使输出更随机，更具创造性；值越小，输出会更加稳定或确定 建议您根据应用场景调整 top_p 或 temperature 参数，但不要同时调整两个参数
top_p	Float	否	用温度取样的另一种方法，称为核取样 取值范围是：[0.0, 1.0]，默认值为 0.6 模型考虑具有 top_p 概率质量 tokens 的结果 例如：0.1 意味着模型解码器只考虑从前 10% 的概率的候选集中取 tokens 建议您根据应用场景调整 top_p 或 temperature 参数，但不要同时调整两个参数
max_tokens	Integer	否	模型最大输出 tokens
user_id	String	否	终端用户的唯一ID，协助平台对终端用户的违规行为、生成违法及不良信息或其他滥用行为进行干预。ID长度要求：最少6个字符，最多128个字符。 了解更多
Messages 格式
模型可接受的消息类型包括 User message、Assistant message ，不同的消息类型格式有所差异。具体如下：

User message
参数名称	类型	必填	参数说明
role	String	是	消息的角色信息，此时应为user
content	List<Object>	是	消息内容。
 type	String	是	文本类型：text
图片类型：image_url
视频类型：video_url
视频和图片类型不能同时输入
 text	String	是	type是text 时补充
 image_url	Object	是	type是image_url 时补充
  url	String	是	图片url或者base64编码。
图像大小上传限制为每张图像 5M以下，且像素不超过 6000*6000。
支持jpg、png、jpeg格式。
说明： GLM-4V-Flash 不支持base64编码
 video_url	Object	是	type是video_url 时补充，仅glm-4v-plus支持视频输入
视频理解时，video_url参数必须在第一个。
  url	String	是	视频url地址。
GLM-4V-Plus视频大小限制为20M以内，视频时长不超过 30s。
GLM-4V-Plus-0111视频大小限制为 200M 以内。
视频类型： mp4 。
Assistant message
参数名称	类型	必填	参数说明
role	String	是	消息的角色信息，此时应为assistant
content	String	是	消息内容
响应参数
参数名称	类型	参数说明
id	String	任务 ID
created	Long	请求创建时间，是以秒为单位的 Unix 时间戳。
model	String	模型名称
choices	List	当前对话的模型输出内容
 index	Integer	结果下标
 finish_reason	String	模型推理终止的原因。
stop代表推理自然结束或触发停止词。
length 代表到达 tokens 长度上限。
sensitive 代表模型推理内容被安全审核接口拦截。
network_error 代表模型推理异常。
 message	Object	模型返回的文本信息
  role	String	当前对话的角色，目前默认为 assistant（模型）
  content	List	当前对话的内容
usage	Object	结束时返回本次模型调用的 tokens 数量统计
 prompt_tokens	Integer	用户输入的 tokens 数量
 completion_tokens	Integer	模型输出的 tokens 数量
 total_tokens	Integer	总 tokens 数量
content_filter	List	返回内容安全的相关信息
 role	String	安全生效环节，包括
role = assistant 模型推理，
role = user 用户输入，
role = history 历史上下文
 level	Integer	严重程度 level 0-3，level 0表示最严重，3表示轻微

## 请求示例
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # 填写您自己的APIKey
response = client.chat.completions.create(
    model="glm-4v-plus-0111",  # 填写需要调用的模型名称
    messages=[
       {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "图里有什么"
          },
          {
            "type": "image_url",
            "image_url": {
                "url" : "https://img1.baidu.com/it/u=1369931113,3388870256&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1703696400&t=f3028c7a1dca43a080aeb8239f09cc2f"
            }
          }
        ]
      }
    ]
)
print(response.choices[0].message)

## 响应示例：
{
    "created": 1703487403,
    "id": "8239375684858666781",
    "model": "glm-4v-plus-0111",
    "request_id": "8239375684858666781",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "图中有一片蓝色的海和蓝天，天空中有白色的云朵。图片的右下角有一个小岛或者岩石，上面长着深绿色的树木。",
                "role": "assistant"
            }
        }
    ],
    "usage": {
        "completion_tokens": 37,
        "prompt_tokens": 1037,
        "total_tokens": 1074
    }
  }